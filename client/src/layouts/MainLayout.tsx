import {Outlet} from 'react-router-dom'
import {Navigation} from '../components/Navigation'
import {Header} from '../components/Header'
import {isConnectedSelector, useGlobalStore} from '../store/useGlobalStore'
import {LoadingScreen} from './LoadingScreen';

export const MainLayout = () => {
    const isConnected = useGlobalStore(isConnectedSelector);
    if (!isConnected) {
        return <div className="bg-gray-50 text-gray-800 h-screen overflow-hidden">
            <LoadingScreen />
        </div>;
    }

    return (
        <div className="bg-gray-50 text-gray-800 grid grid-cols-[1fr]  grid-rows-[50px_1fr_64px] h-screen overflow-hidden">
            <Header />
            <div className="border border-gray-700 overflow-x-auto">
                <Outlet />
            </div>
            <Navigation />
        </div>
    )
}
