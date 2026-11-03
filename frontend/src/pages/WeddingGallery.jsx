import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import Breadcrumbs from "../components/Breadcrumbs";
import { API_URL } from "../config";
import "./WeddingGallery.css";


const WeddingGallery = () => {
  useSEO({
    title: "Wedding Photography in Bangalore | Candid & Editorial | Shoot At Sight",
    description: "Candid and editorial wedding photography in Bangalore and beyond. What is included, team size, deliverables and timelines.",
  });

  const [verticalShoots, setVerticalShoots] = useState([]);
  const [horizontalShoots, setHorizontalShoots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShoots = async () => {
      try {
        const res = await fetch(`${API_URL}/shoots`);
        const data = await res.json();
        const weddingShoots = (data.data || []).filter(
          (s) => s.category?.toLowerCase() === "wedding"
        );

        const verts = [];
        const horizs = [];

        await Promise.all(
          weddingShoots.map((shoot) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                if (img.naturalHeight > img.naturalWidth) {
                  verts.push(shoot);
                } else {
                  horizs.push(shoot);
                }
                resolve();
              };
              img.onerror = () => {
                if (
                  shoot.title?.toLowerCase().includes("priyanka") ||
                  shoot.title?.toLowerCase().includes("shipra") ||
                  shoot.title?.toLowerCase().includes("raghu")
                ) {
                  verts.push(shoot);
                } else {
                  horizs.push(shoot);
                }
                resolve();
              };
              img.src = shoot.heroImage;
            });
          })
        );

        setVerticalShoots(verts);
        setHorizontalShoots(horizs);
      } catch (err) {
        console.error("Failed to fetch shoots", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoots();
  }, []);

  return (
    <div className="wg-page">
      <Breadcrumbs />

      {/* Header */}
      <div className="wg-header">
        <Link to="/portfolio" className="wg-back">&#8592; BACK TO GALLERIES</Link>
        <h1 className="wg-title">
          celebrating{" "}
          <span className="wg-title-normal">Unforgettable</span>{" "}
          <span className="wg-title-script">Moments</span>
        </h1>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="wg-loading">
          <span className="wg-spinner" />
        </div>
      )}

      {/* Paired Orientation Sections */}
      {!loading && (
        <div className="wg-sections-container">

          {/* Vertical Couples Pair Row (3-col portrait grid) */}
          {verticalShoots.length > 0 && (
            <div className="wg-pair-section">
              <div className="wg-pair-grid wg-pair-grid--vertical">
                {verticalShoots.map((shoot) => (
                  <Link
                    key={shoot.slug}
                    to={`/shoot/${shoot.slug}`}
                    className="wg-cell wg-cell--vertical"
                  >
                    <img
                      src={shoot.heroImage}
                      alt={shoot.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8213.webp";
                      }}
                    />
                    <div className="wg-cell-overlay">
                      <span className="wg-couple-name">{shoot.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Horizontal Couples Pair Row (2-col landscape grid) */}
          {horizontalShoots.length > 0 && (
            <div className="wg-pair-section">
              <div className="wg-pair-grid wg-pair-grid--horizontal">
                {horizontalShoots.map((shoot) => (
                  <Link
                    key={shoot.slug}
                    to={`/shoot/${shoot.slug}`}
                    className="wg-cell wg-cell--horizontal"
                  >
                    <img
                      src={shoot.heroImage}
                      alt={shoot.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8213.webp";
                      }}
                    />
                    <div className="wg-cell-overlay">
                      <span className="wg-couple-name">{shoot.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default WeddingGallery;
