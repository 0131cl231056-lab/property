import React, { useState, useEffect, useMemo } from "react";
import { X, Building2, Mail, Phone, MapPin } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import PropertyTable from "../components/PropertyTable";
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
const STATUSES = ["For Sale", "Sold"];
const AREA_UNITS = { sqft: "sq ft", acre: "acres", acres: "acres" };
const ITEMS_PER_PAGE = 8;
const CLOSED_MODAL = { isOpen: false, type: "", propertyId: null };

export default function AdminProperties() {
  const {
    allProperties = [],
    handleGetAllProperties,
    handleMarkPropertyAsSold,
    handleDeleteProperty,
  } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [confirmModal, setConfirmModal] = useState(CLOSED_MODAL);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        await handleGetAllProperties();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  // Close the details modal with Escape
  useEffect(() => {
    if (!selectedProperty) return;
    const onKey = (e) => e.key === "Escape" && setSelectedProperty(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProperty]);

  const hasFilters = Boolean(search || category || city || status);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCity("");
    setStatus("");
  };

  const filteredProperties = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allProperties.filter((p) => {
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.createdBy?.fullname?.toLowerCase().includes(q) ||
        p._id?.toLowerCase().includes(q);
      return (
        matchesSearch &&
        (!category || p.category === category) &&
        (!city || p.city === city) &&
        (!status || p.status === status)
      );
    });
  }, [allProperties, search, category, city, status]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  // Go back to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, city, status]);

  // If the last item on a page is deleted, step back a page
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const openConfirm = (type) => (id) =>
    setConfirmModal({ isOpen: true, type, propertyId: id });

  const handleConfirmAction = async () => {
    const { type, propertyId } = confirmModal;
    if (!propertyId) return;

    setActionLoading(true);
    try {
      if (type === "sold") await handleMarkPropertyAsSold(propertyId);
      else if (type === "delete") await handleDeleteProperty(propertyId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setConfirmModal(CLOSED_MODAL);
    }
  };

  const pageButton =
    "rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-8xl space-y-8 px-7 py-2 text-left">
        {/* ─── Header ─── */}
        <section>
          <h1
            className="text-3xl font-extrabold tracking-tight text-gray-900"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Property listings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {loading
              ? "Loading listings..."
              : `Manage all ${allProperties.length} properties on the platform.`}
          </p>
        </section>

        {/* ─── Filters ─── */}
        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by title, seller or ID"
              className="flex-1"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <FilterDropdown
                label="All statuses"
                value={status}
                onChange={setStatus}
                options={STATUSES}
                className="w-full sm:w-40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
            <p className="text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProperties.length}
              </span>{" "}
              {filteredProperties.length === 1 ? "property" : "properties"}
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
        </section>

        {/* ─── Table ─── */}
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-stone-200 bg-white py-24">
            <div
              className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"
              role="status"
              aria-label="Loading properties"
            />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white">
            <EmptyState
              icon={Building2}
              title="No properties found"
              description="Try a different search or remove some filters."
              action={{ label: "Clear filters", onClick: clearFilters }}
            />
          </div>
        ) : (
          <section className="space-y-5">
            <div className={actionLoading ? "pointer-events-none opacity-60 transition" : "transition"}>
              <PropertyTable
                properties={paginatedProperties}
                onView={setSelectedProperty}
                onMarkSold={openConfirm("sold")}
                onDelete={openConfirm("delete")}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-gray-500">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                  <span className="font-semibold text-gray-900">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                    disabled={currentPage === 1}
                    className={pageButton}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={pageButton}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ─── Property details modal ─── */}
      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Property details"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProperty(null)}
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative h-56 shrink-0 bg-gray-100">
              <img
                src={
                  selectedProperty.propertyImages?.[0] ||
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
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
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h2
                    className="text-xl font-bold leading-snug text-gray-900"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {selectedProperty.title}
                  </h2>
                  <StatusBadge status={selectedProperty.status} />
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

              <div className="rounded-2xl border border-stone-200 p-5">
                <p className="mb-4 text-sm font-semibold text-gray-900">Seller</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                    {selectedProperty.createdBy?.fullname?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">
                      {selectedProperty.createdBy?.fullname}
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{selectedProperty.createdBy?.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {selectedProperty.createdBy?.contact}
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

      {/* ─── Confirmation modal ─── */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(CLOSED_MODAL)}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === "sold" ? "Mark property as sold" : "Delete property listing"}
        message={
          confirmModal.type === "sold"
            ? "This will mark the property as Sold and update its availability on the website."
            : "This will permanently delete the listing. This can't be undone."
        }
        confirmText={confirmModal.type === "sold" ? "Mark as sold" : "Delete listing"}
        cancelText="Cancel"
        isDanger={confirmModal.type === "delete"}
      />
    </AdminLayout>
  );
}
