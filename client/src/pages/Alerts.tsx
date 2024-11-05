import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import { alerts } from '../data/alerts';

const Alerts = () => {
  return (
    <div className="min-h-screen bg-charcoal text-crispWhite py-8">
      <LeftFeedNav />
      <h1 className="text-4xl font-bold text-center mb-8">Alerts</h1>
      <div className="container mx-auto px-4">
        <div className="max-w-[50%] mx-auto space-y-6">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-charcoal border-b border-steelGray"
            >
              <img
                src={alert.userProfilePic}
                alt={`${alert.user} profile`}
                className="w-12 h-12 rounded-full border border-steelGray-2 mr-4 object-cover"
              />
              <div className="flex-grow">
                <p className="text-lg font-semibold">
                  {alert.user}{' '}
                  <span className="text-sm text-crispWhite font-normal">
                    {alert.notificationType === 'Vote'
                      ? 'voted on your post'
                      : 'started following you'}
                  </span>
                </p>
                <p className="text-sm text-steelGray">{alert.time} ago</p>
              </div>
              {alert.notificationType === 'Vote' ? (
                <img
                  src={alert.thumbnail}
                  alt="Thumbnail"
                  className="w-32 aspect-[16/9] rounded-lg object-cover ml-4"
                />
              ) : (
                <button className="bg-cornflowerBlue hover:bg-steelGray px-4 py-2 rounded">
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Alerts;
