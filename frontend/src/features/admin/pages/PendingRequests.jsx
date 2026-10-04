import React, { useState, useEffect, useMemo } from "react";
import { X, ClipboardList, Mail, Phone, Calendar, MapPin } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import PropertyCard from "../components/PropertyCard";
import ConfirmationModal from "../components/ConfirmationModal";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import useAdmin from "../hook/useAdmin";
import { formatPrice } from "../../../utils/formatPrice";

const CATEGORIES = [
  "Apartment",
  "Villa",
  "Independent House",
  "Farm House",
  "Residential Plot",
  "Commercial Plot",
  "Office",
  "Shop",
  "Warehouse",
  "Agricultural Land",
];
const CITIES = ["Bhopal", "Indore", "Delhi", "Mumbai", "Pune", "Bangalore"];
const AREA_UNITS = { sqft: "sq ft", acre: "acres", acres: "acres" };
const CLOSED_MODAL = { isOpen: false, type: "", propertyId: null };

export default function PendingRequests() {
  const {
    pendingProperties = [],
    handleGetPendingProperties,
    handleApproveProperty,
    handleRejectProperty,
  } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(CLOSED_MODAL);

  useEffect(() => {
    async function loadPending() {
      setLoading(true);
      try {
        await handleGetPendingProperties();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPending();
  }, []);

  const hasFilters = Boolean(search || category || city);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCity("");
  };

  const filteredPending = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pendingProperties.filter((p) => {
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.seller?.fullname?.toLowerCase().includes(q);
      return (
        matchesSearch &&
        (!category || p.category === category) &&
        (!city || p.city === city)
      );
    });
  }, [pendingProperties, search, category, city]);

  // Mount the drawer first, then slide it in on the next frame
  const handleOpenDrawer = (property) => {
    setSelectedProperty(property);
    requestAnimationFrame(() => setIsDrawerOpen(true));
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedProperty(null), 300);
  };

  // Close the drawer with Escape (unless the confirm modal is open)
  useEffect(() => {
    if (!selectedProperty || confirmModal.isOpen) return;
    const onKey = (e) => e.key === "Escape" && handleCloseDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProperty, confirmModal.isOpen]);

  const openConfirm = (type) => (id) =>
    setConfirmModal({ isOpen: true, type, propertyId: id });

  const handleConfirmAction = async () => {
    const { type, propertyId } = confirmModal;
    if (!propertyId) return;

    setActionLoading(true);
    try {
      if (type === "approve") await handleApproveProperty(propertyId);
      else if (type === "reject") await handleRejectProperty(propertyId);
      await handleGetPendingProperties();

      if (selectedProperty?._id === propertyId) handleCloseDrawer();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setConfirmModal(CLOSED_MODAL);
    }
  };

  const submittedOn = selectedProperty?.createdAt
    ? new Date(selectedProperty.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <AdminLayout>
      <div className="relative mx-auto w-full max-w-8xl space-y-8 overflow-hidden px-7 py-6 text-left">
        {/* ─── Header ─── */}
        <section>
          <h1
            className="text-3xl font-extrabold tracking-tight text-gray-900"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Pending requests
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Check each new listing from sellers, then approve it to publish it or
            reject it to remove it from the queue.
          </p>
        </section>

        {/* ─── Filters ─── */}
        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by property or seller"
              className="flex-1"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FilterDropdown
                label="All categories"
                value={category}
                onChange={setCategory}
                options={CATEGORIES}
                className="w-full sm:w-44"
              />
              <FilterDropdown
                label="All cities"
                value={city}
                onChange={setCity}
                options={CITIES}
                className="w-full sm:w-40"
              />
            </div>
          </div>

          {!loading && (
            <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
              <p className="text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredPending.length}
                </span>{" "}
                pending {filteredPending.length === 1 ? "request" : "requests"}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="font-semibold text-gray-700 underline-offset-4 transition hover:text-gray-950 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* ─── Cards ─── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"
              role="status"
              aria-label="Loading requests"
            />
          </div>
        ) : filteredPending.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white">
            <EmptyState
              icon={ClipboardList}
              title={hasFilters ? "No matching requests" : "All caught up"}
              description={
                hasFilters
                  ? "Try a different search or remove some filters."
                  : "No properties are waiting for approval right now."
              }
              action={hasFilters ? { label: "Clear filters", onClick: clearFilters } : undefined}
            />
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-8 transition sm:grid-cols-2 lg:grid-cols-3 ${
              actionLoading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {filteredPending.map((p) => (
              <PropertyCard
                key={p._id}
                property={p}
                onApprove={openConfirm("approve")}
                onReject={openConfirm("reject")}
                onView={handleOpenDrawer}
                showGallery={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Details drawer ─── */}
      {selectedProperty && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={handleCloseDrawer}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Submission details"
            className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Image with close button */}
            <div className="relative h-60 shrink-0 bg-gray-100">
              <img
                src={
                  selectedProperty.propertyImages?.[0] ||
                  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
                }
                alt={selectedProperty.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4">
                <StatusBadge status={selectedProperty.status} />
              </div>
              <button
                onClick={handleCloseDrawer}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-700 shadow transition hover:bg-white hover:text-gray-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="space-y-2">
                <h2
                  className="text-xl font-bold leading-snug text-gray-900"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {selectedProperty.title}
                </h2>
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

              {submittedOn && (
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Submitted on{" "}
                  <span className="font-semibold text-gray-800">{submittedOn}</span>
                </p>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">Amenities</p>
                {selectedProperty.amenities?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">The seller didn't list any amenities.</p>
                )}
              </div>

              <div className="rounded-2xl border border-stone-200 p-5">
                <p className="mb-4 text-sm font-semibold text-gray-900">Seller</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                    {selectedProperty.seller?.fullname?.charAt(0)?.toUpperCase() || "U"}
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

            {/* Sticky actions */}
            <div className="flex items-center gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
              <button
                onClick={() => openConfirm("reject")(selectedProperty._id)}
                className="flex-1 rounded-xl border border-stone-300 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-stone-100"
              >
                Reject
              </button>
              <button
                onClick={() => openConfirm("approve")(selectedProperty._id)}
                className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Approve
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ─── Confirmation modal ─── */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(CLOSED_MODAL)}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === "approve" ? "Approve this listing" : "Reject this listing"}
        message={
          confirmModal.type === "approve"
            ? "The property will go live and buyers will be able to see it."
            : "The listing will be removed from the pending queue."
        }
        confirmText={confirmModal.type === "approve" ? "Approve" : "Reject"}
        cancelText="Cancel"
        isDanger={confirmModal.type === "reject"}
      />
    </AdminLayout>
  );
}
