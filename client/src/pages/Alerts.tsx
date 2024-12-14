import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { Notification } from '../types/Notification';
import { useAuth } from '../context/AuthContext';
import FollowButton from '../components/FollowButton';
import ProfileLink from '../components/ProfileLink';
import { useNavigate } from "react-router-dom";
import FeedHeader from '@/components/FeedHeader';

const Alerts = () => {
    const [alerts, setAlerts] = useState<Notification[]>([]); // Type defined using Notification interface
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlerts(response.data);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <div className="min-h-screen bg-charcoal text-crispWhite">
            <FeedHeader />
            <h1 className="text-4xl font-bold text-center my-8">Alerts</h1>
            <div className="container mx-auto px-4">
                {loading ? (
                    <p className="text-center">Loading alerts...</p>
                ) : alerts.length === 0 ? (
                    <p className="text-center text-lg text-steelGray">
                        You have no notifications at the moment.
                    </p>
                ) : (
                    <div className="max-w-[50%] mx-auto space-y-6">
                      {alerts.map((alert) => (
                        <div
                          key={alert._id}
                          className="flex items-center p-4 bg-charcoal border-b border-steelGray cursor-pointer"
                          onClick={alert.type === "Vote" || alert.type === "Comment" ? () => navigate(`/films/${alert.film?._id}`) : undefined}
                        >
                          <img
                            src={alert.initiator.profilePhotoUrl || '/default-avatar.png'} // Fallback URL
                            alt={`${alert.initiator.username} profile`}
                            className="w-16 h-16 z-10 rounded-full border border-steelGray-2 mr-4 object-cover hover:border-cornflowerBlue"
                            onClick={(e) => {
                              navigate(`/profile/${alert.user}`)
                              e.stopPropagation()
                            }}
                          />
                          <div className="flex-grow">
                          <p className="text-lg font-semibold">
                            <ProfileLink username={alert.initiator.username} userId={alert.initiator._id}/>{' '}
                            <span className="text-sm text-crispWhite font-normal">
                              {alert.type === 'Vote' && (
                                <>
                                  voted on <strong className="font-bold">{alert.film?.title}</strong>
                                </>
                              )}
                              {alert.type === 'Follow' && 'started following you'}
                              {alert.type === 'Comment' && (
                                <>
                                  commented on <strong className="font-bold">{alert.film?.title}</strong>
                                </>
                              )}
                            </span>
                          </p>
                            {alert.type === 'Comment' && alert.commentText && (
                              <div className='bg-[#1a2128] mb-1 rounded-lg'>
                                <p className="text-sm text-steelGray py-2 pl-3">{alert.commentText}</p>
                              </div>
                            )}
                            <p className="text-sm text-steelGray">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {alert.type === 'Vote' || alert.type === 'Comment' ? (
                            <img
                              src={alert.film?.thumbnailUrl || '/default-thumbnail.png'} // Fallback URL
                              alt="Film Thumbnail"
                              className="w-32 aspect-[16/9] rounded-lg object-cover ml-4"
                            />
                          ) : (
                            <FollowButton targetUserId={alert.initiator._id || ''} token={token || ''} />
                          )}
                        </div>
                      ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Alerts;
