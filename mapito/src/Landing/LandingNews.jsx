import React from 'react';
import LandingNavbar from './LandingNavbar';

export default function LandingNews() {
    const notices = [
        {
            id: 1,
            type: 'System Weakness',
            title: 'Branded Loading Screen after Google Login',
            description: 'ဒီပြသာနာကတော့UserကGoogleနဲ့Loginဝင်မယ်ဆိုရင်render websiteရဲ့ branded loading screenကစက္ကန့်၂၀လောက်ပေါ်နေတာကြောင့် ဒီsystemရဲ့main weaknessဖြစ်ပါတယ်။',
            severity: 'High'
        },
        {
            id: 2,
            type: 'Notice',
            title: 'AI Response Preparation',
            description: 'AIကိုresponseကောင်းတွေပြန်ပေးဖို့promptပေးထားပေမဲ့userရဲ့vpn connection(သို့မဟုတ်)network errorကြောင့်ဖြစ်ဖြစ်AIရဲ့free tier limitပြည့်သွားလို့ဖြစ်ဖြစ်အခြေအနေမျိုုးတွေဖြစ်ခဲ့ရင်developerကြိုတင်စီမံထားတဲ့predefind responseတွေကိုသာuserတွေကရရှိမှာဖြစ်ပါတယ်။',
            severity: 'Medium'
        },
    ];

    // Function to determine severity badge color
    const getSeverityClasses = (severity) => {
        switch (severity) {
            case 'High':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-blue-100 text-blue-800';
            case 'Info':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="min-h-screen mt-15 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <LandingNavbar />
        <div>
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
                    System Notices & Instructions
                </h1>

                <p className="text-gray-600 text-base sm:text-lg mb-8 text-center max-w-2xl mx-auto">
                    Stay informed about important system notices and any known issues. We are committed to transparency and providing you with the best possible service.
                </p>

                <div className="space-y-6">
                    {notices.map((notice) => (
                        <div
                            key={notice.id}
                            className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 flex flex-col md:flex-row md:items-start md:space-x-4"
                        >
                            {/* Type and Date Section */}
                            <div className="flex-shrink-0 md:w-1/4 mb-3 md:mb-0">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getSeverityClasses(notice.severity)}`}>
                                    {notice.type === 'System Weakness' ? 'Weakness' : 'Notice'}
                                </span>
                                <p className="text-gray-500 text-sm mt-2">{notice.date}</p>
                            </div>

                            {/* Content Section */}
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h2>
                                <p className="text-gray-700 text-base leading-relaxed">{notice.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center text-gray-500 text-sm">
                    Last updated: June 10, 2025 by Wint Wah
                </div>
            </div>
        </div>
        </section>
    );
}
