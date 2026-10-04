import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProperty from "../../property/hook/useProperty";
import { formatPrice } from "../../../utils/formatPrice";

const BrowseByCity = () => {
    const { handleGetLocations } = useProperty();
    const [cities, setCities] = useState([]);

    useEffect(() => {
        async function fetchCities() {
            try {
                const data = await handleGetLocations();
                setCities(data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchCities();
    }, []);

    return (
        <section className="py-8 ">
            <div className="w-full max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">

                    <h2 className="text-4xl font-bold text-stone-900 mt-2">
                        Explore by City
                    </h2>

                    <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
                        Browse verified properties across India's most popular
                        cities.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
                    {cities.map((city) => (
                        <Link
                            key={city.city}
                            to={`/properties?city=${city.city}`}
                            className="group relative h-72 rounded-3xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={city.image}
                                alt={city.city}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-3xl font-bold capitalize">
                                    {city.city}
                                </h3>

                                <p className="text-sm mt-1">
                                    {city.propertyCount} Properties
                                </p>

                                {city.startPrice && (
                                    <p className="text-sm opacity-90 mt-1">
    Starting from{" "}
    {formatPrice(city.startPrice)}
</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrowseByCity;