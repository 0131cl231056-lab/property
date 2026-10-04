import React, { useState, useEffect } from "react";
import {
  Building2,
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import PropertyCard from "../components/PropertyCard";
import { CardSkeleton, StatCardSkeleton } from "../components/LoadingSkeleton";
import useAdmin from "../hook/useAdmin";
import { formatPrice } from "../../../utils/formatPrice";

const AREA_UNITS = { sqft: "sq ft", acre: "acres", acres: "acres" };

export default function Dashboard() {
  const {
    dashboardStats,
    pendingProperties = [],
    handleDashboardStats,
    handleGetAllProperties,
    handleGetPendingProperties,
  } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        await Promise.all([
          handleDashboardStats(),
          handleGetAllProperties(),
          handleGetPendingProperties(),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Close the modal with the Escape key
  useEffect(() => {
    if (!selectedProperty) return;
    const onKey = (e) => e.key === "Escape" && setSelectedProperty(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProperty]);

  const statsConfig = [
    { title: "Total properties", value: dashboardStats?.totalProperties || 0, icon: Building2 },
    { title: "Pending", value: dashboardStats?.pendingProperties || 0, icon: Clock },
    { title: "Approved", value: dashboardStats?.approvedProperties || 0, icon: CheckCircle2 },
    { title: "Users", value: dashboardStats?.totalUsers || 0, icon: User },
  ];

  const pendingCount = pendingProperties.length;

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-8xl space-y-10 px-7 py-6 text-left">
        {/* ─── Header: the one bold element on the page ─── */}
        <section className="flex flex-col gap-6 rounded-3xl bg-gray-900 px-8 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Dashboard
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-300">
              {loading
                ? "Loading the latest submissions..."
                : pendingCount === 0
                ? "Every submission has been reviewed."
                : `${pendingCount} ${
                    pendingCount === 1 ? "property is" : "properties are"
                  } waiting for your review.`}
            </p>
          </div>

          <Link
            to="/admin/pending"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Review requests
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* ─── Statistics ─── */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : statsConfig.map((card, i) => (
                <StatCard key={card.title} {...card} delay={i * 70} />
              ))}
        </section>

        {/* ─── Latest submissions ─── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-stone-200 pb-4">
            <div>
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Latest property submissions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing up to 6 of the newest listings awaiting approval.
              </p>
            </div>
            <Link
              to="/admin/pending"
              className="hidden items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-gray-950 sm:inline-flex"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : pendingCount === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-10">
              <EmptyState
                icon={Building2}
                title="All caught up"
                description="No properties are waiting for approval right now."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pendingProperties.slice(0, 6).map((prop) => (
                <PropertyCard
                  key={prop._id}
                  property={prop}
                  onView={setSelectedProperty}
                  showGallery={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ─── Property details modal ─── */}
      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Property submission details"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProperty(null)}
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Image with close button on top */}
            <div className="relative h-56 shrink-0 bg-gray-100">
              <img
                src={
                  selectedProperty.propertyImages?.[0] ||
                  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
                }
                alt={selectedProperty.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedProperty(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-700 shadow transition hover:bg-white hover:text-gray-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto p-7">
              {/* Title, location, price */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h2
                    className="text-xl font-bold leading-snug text-gray-900"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {selectedProperty.title}
                  </h2>
                  <StatusBadge
                    status={selectedProperty.approvalStatus || selectedProperty.status}
                  />
                </div>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {[selectedProperty.city, selectedProperty.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-2xl font-extrabold text-gray-950">
                  {formatPrice(selectedProperty.price)}
                </p>
              </div>

              {/* Specifications */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Category</dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {selectedProperty.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Area</dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {selectedProperty.area}{" "}
                    {AREA_UNITS[selectedProperty.areaUnit] || selectedProperty.areaUnit || ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Bedrooms</dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {selectedProperty.bedrooms}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Bathrooms</dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {selectedProperty.bathrooms}
                  </dd>
                </div>
              </dl>

              {/* Seller */}
              <div className="rounded-2xl border border-stone-200 p-5">
                <p className="mb-4 text-sm font-semibold text-gray-900">Seller</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                    {selectedProperty.seller?.fullname?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">
                      {selectedProperty.seller?.fullname}
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{selectedProperty.seller?.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {selectedProperty.seller?.contact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-stone-200 bg-stone-50 px-7 py-4">
              <button
                onClick={() => setSelectedProperty(null)}
                className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}