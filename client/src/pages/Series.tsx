import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Series } from "@/types/Series";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import FeedHeader from "@/components/FeedHeader";
import { Tabs } from '@chakra-ui/react';
import { useIsMobile } from "@/context/MobileContext";
import ProfileLink from "@/components/ProfileLink";

const Series = () => {
    const [series, setSeries] = useState<Series | null>(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const { seriesId } = useParams();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // Fetch series data
    const fetchSeries = async () => {
        try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/series/${seriesId}`
        );
        if (response.data.message === "This film is not part of a series") {
            console.log("The film is standalone and not part of any series.");
            setSeries(null);
        } else {
            setSeries(response.data);
        }
        } catch (err) {
        console.error("Error fetching series data:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
        <div className="flex items-center justify-center h-screen text-red-600 text-xl">
            {error}
        </div>
        );
    }

    if (!series) {
        return (
        <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
            This film is not part of any series.
        </div>
        );
    }

    return (
        <>
            <FeedHeader />
            <div className="bg-charcoal min-h-screen flex flex-col items-center">
                <div className="flex flex-col container max-w-[75%] justify-center">
                    <div className="flex justify-center mt-8">
                        <div
                            key={series._id}
                            className="relative shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
                        >
                            <div className="aspect-w-16 aspect-h-9"> {/* Ensures a 16:9 aspect ratio */}
                                <img
                                    src={series.films[0].thumbnailUrl}
                                    alt={series.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent rounded-lg pointer-events-none"></div>
                            <div className="absolute bottom-[15%] left-[5%] text-crispWhite z-10">
                                <h2 className="text-4xl font-semibold mb-2">{series.title.toLocaleUpperCase()}</h2>
                                <div className="flex items-center text-gray-200 text-sm">
                                    <p className="text-steelGray mr-1">A series created by </p> 
                                    <ProfileLink username={series.createdBy.username} userId={series.createdBy._id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex w-full bg-darkCharcoal py-4 px-8">
                        <div className="flex w-full">
                            <Tabs.Root lazyMount unmountOnExit defaultValue="films">
                                <Tabs.List className={`mb-2 w-full`}>
                                    <Tabs.Trigger className='p-4' value="films">Films</Tabs.Trigger>
                                    <Tabs.Trigger className='p-4' value="recommended">You May Also Like</Tabs.Trigger>
                                    <Tabs.Trigger className='p-4' value="details">Details</Tabs.Trigger>
                                </Tabs.List>

                                <Tabs.Content value='films'>
                                    <div className="flex w-full">
                                        {series.films.map((film, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col m-4 items-start gap-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden w-64 cursor-pointer"
                                                onClick={() => navigate(`/films/${film._id}`)}
                                            >
                                                <img
                                                    src={film.thumbnailUrl}
                                                    alt={film.title}
                                                    className="w-64 h-36 object-cover rounded-lg"
                                                />
                                                <div className="flex flex-col px-1">
                                                    <h3 className="text-lg font-semibold">{film.title}</h3>
                                                    <p className="text-gray-600 text-sm break-words">{film.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Tabs.Content>

                                <Tabs.Content value='recommended'>

                                </Tabs.Content>

                                <Tabs.Content value='details'>
                                    <div className="flex flex-col items-start gap-4 p-6 bg-darkCharcoal rounded-lg shadow-lg text-crispWhite max-w-3xl">
                                        {/* Title */}
                                        <h2 className="text-3xl font-bold">{series.title}</h2>

                                        {/* Created By */}
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span className="font-semibold text-gray-200">Created by:</span>
                                            <div className="ml-1">
                                                <ProfileLink username={series.createdBy.username} userId={series.createdBy._id} />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-300 text-base leading-relaxed">Lorem ipsum odor amet, consectetuer adipiscing elit. Ahendrerit torquent accumsan torquent; velit volutpat pulvinar eros. Nulla nostra per viverra tempor ligula cras ultrices velit. Auctor mollis cras in nibh sit turpis vel convallis. Volutpat tortor mus viverra et est.</p>

                                        {/* Additional Details */}
                                        <div className="w-full flex flex-col gap-2 mt-4">
                                            <div className="flex w-full items-center justify-between text-sm">
                                                <span className="font-semibold text-gray-200">Genre:</span>
                                                <span className="text-gray-300">{"Unknown"}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold text-gray-200">Number of Films:</span>
                                                <span className="text-gray-300">{series.films.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold text-gray-200">Created On:</span>
                                                <span className="text-gray-300">
                                                    {new Date(series.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Tabs.Content>

                            </Tabs.Root>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Series;
