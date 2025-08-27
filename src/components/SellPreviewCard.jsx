import React, { useMemo, useState, useEffect } from "react";

const formatPrice = (price) => {
  const n = Number(price);
  if (Number.isNaN(n)) return price || "—";
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(n);
};

const resolveImageSrc = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (img && typeof img === "object") {
    if (img.url && typeof img.url === "string") return img.url;
    if (img.path && typeof img.path === "string") return img.path;
  }
  return "";
};

const SellPreviewCard = ({ car }) => {
  const imagesArr = useMemo(() => {
    return Array.isArray(car?.images) && car.images.length > 0
      ? car.images
      : [car?.image];
  }, [car?.images, car?.image]);

  const [active, setActive] = useState(0);
  const [objectUrls, setObjectUrls] = useState([]);

  useEffect(() => {
    // Build object URLs for Blobs to support slider
    const urls = imagesArr.map((img) =>
      img instanceof Blob ? URL.createObjectURL(img) : null
    );
    setObjectUrls(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [imagesArr]);

  const currentSrc = useMemo(() => {
    const img = imagesArr[active];
    if (img instanceof Blob) return objectUrls[active] || "";

    // Handle local blob URLs (fallback from CORS issues)
    if (img && typeof img === "object" && img.isLocal && img.url) {
      return img.url;
    }

    return resolveImageSrc(img);
  }, [active, imagesArr, objectUrls]);

  const go = (dir) => {
    setActive((p) => {
      if (dir === -1) return p === 0 ? imagesArr.length - 1 : p - 1;
      return p === imagesArr.length - 1 ? 0 : p + 1;
    });
  };

  const priceText = formatPrice(car?.price);
  const originalText =
    car?.originalPrice && car?.originalPrice !== car?.price
      ? formatPrice(car?.originalPrice)
      : null;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-xlsoft overflow-hidden">
      {/* Image slider */}
      <div className="relative w-full h-56 md:h-64 bg-gray-50">
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={`${car?.brand} ${car?.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("Image failed to load, using fallback");
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">
            لا توجد صورة
          </div>
        )}
        {imagesArr.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/55 text-white rounded-full w-8 h-8 grid place-items-center"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/55 text-white rounded-full w-8 h-8 grid place-items-center"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {imagesArr.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === active ? "bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {car?.year} {car?.brand} {car?.model}
              {car?.trim ? ` ${car?.trim}` : ""}
            </h3>
            <p className="text-sm text-gray-500">{car?.bodyType || "—"}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-emerald-700">
              {priceText}
            </div>
            {originalText && (
              <div className="text-xs text-gray-500 line-through">
                {originalText}
              </div>
            )}
            <div className="mt-1 text-xs text-emerald-700 bg-emerald-50 inline-flex items-center gap-1 px-2 py-1 rounded-full">
              <span>
                {car?.negotiable ? "قابل للتفاوض" : "غير قابل للتفاوض"}
              </span>
            </div>
          </div>
        </div>

        {/* Bullets */}
        <div className="mt-3 space-y-1 text-sm text-gray-700">
          <div>• {car?.mileage || "—"} كم</div>
          <div>
            •{" "}
            {car?.accidents === 0 ? "لا توجد حوادث" : `${car?.accidents} حادث`},{" "}
            {car?.owners || 1} مالك،{" "}
            {car?.usage === "personal"
              ? "استخدام شخصي"
              : car?.usage === "commercial"
              ? "استخدام تجاري"
              : car?.usage === "rental"
              ? "استخدام تأجير"
              : "استخدام شخصي"}
          </div>
          {car?.engine && <div>• {car.engine}</div>}
          {car?.location && <div>• {car.location}</div>}
        </div>

        {/* Features */}
        {Array.isArray(car?.features) && car.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {car.features.slice(0, 8).map((f, i) => (
              <span
                key={`${f}-${i}`}
                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4">
          <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
            تحقق من التوفر
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellPreviewCard;
