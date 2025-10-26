import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {MainLayout} from './layouts/MainLayout';
import {MonitorPage} from "./pages/Monitor/index.jsx";
import {PresetsPage} from "./pages/Presets/index.jsx";
import {PresetPage} from "./pages/Preset/index.jsx";
import {ConfigPage} from "./pages/Config/index.jsx";

import {WsService} from './service/WsService';
import {ThemeProvider} from "flowbite-react";
import {ConfigTimePage} from "./pages/ConfigTime/index.jsx";
import {Toaster} from "sonner";
import {DebugPage} from "./pages/Debug/index.jsx";

const theme = {
    accordion: {
        "root": {
            "base": "!border-green-100 !rounded-none divide-y divide-gray-200 border-gray-200",
            "flush": {
                "off": " border",
                "on": "border-b"
            }
        },
        "content": {
            "base": "p-4"
        },
        "title": {
            "arrow": {
                "base": "h-4 w-4 shrink-0",
                "open": {
                    "off": "",
                    "on": "rotate-180"
                }
            },
            "base": "!ring-0 flex w-full !rounded-none items-center justify-between p-5 text-left font-medium text-gray-500",
            "flush": {
                "off": "",
                "on": "bg-transparent"
            },
            "heading": "",
            "open": {
                "off": "bg-gray-100 p-2 px-4 text-gray-700 font-semibold text-sm",
                "on": "bg-gray-100 p-2 px-4 text-gray-700 font-semibold text-sm"
            }
        }
    },
    textInput: {
        "base": "flex",
        "addon": "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
        "field": {
            "base": "relative w-full",
            "icon": {
                "base": "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
                "svg": "h-5 w-5 text-gray-500 dark:text-gray-400"
            },
            "rightIcon": {
                "base": "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
                "svg": "h-5 w-5 text-gray-500 dark:text-gray-400"
            },
            "input": {
                "base": "block w-full border !rounded-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
                "sizes": {
                    "sm": "p-2 sm:text-xs",
                    "md": "p-2.5 text-sm",
                    "lg": "p-4 sm:text-base"
                },
                "colors": {
                    "gray": "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                    "info": "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
                    "failure": "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
                    "warning": "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
                    "success": "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500"
                },
                "withRightIcon": {
                    "on": "pr-10",
                    "off": ""
                },
                "withIcon": {
                    "on": "pl-10",
                    "off": ""
                },
                "withAddon": {
                    "on": "rounded-r-lg",
                    "off": "rounded-lg"
                },
                "withShadow": {
                    "on": "shadow-sm dark:shadow-sm-light",
                    "off": ""
                }
            }
        }
    }
};

const wsService = new WsService();
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//       <ThemeProvider theme={theme}>
//           <BrowserRouter>
//               <Routes>
//                   <Route path="/" element={<MainLayout />}>
//                       <Route index element={<MonitorPage />} />
//                       <Route path="presets" element={<PresetsPage />} />
//                       <Route path="presets/:id" element={<PresetPage />} />
//                       <Route path="config" element={<ConfigPage />} />
//                       <Route path="debug" element={<DebugPage />} />
//                       <Route path="config/time" element={<ConfigTimePage />} />
//                   </Route>
//               </Routes>
//           </BrowserRouter>
//       </ThemeProvider>
//       <Toaster />
//   </StrictMode>,
// )

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<MonitorPage />} />
                        <Route path="presets" element={<PresetsPage />} />
                        <Route path="presets/:id" element={<PresetPage />} />
                        <Route path="config" element={<ConfigPage />} />
                        <Route path="debug" element={<DebugPage />} />
                        <Route path="config/time" element={<ConfigTimePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
        <Toaster />
    </StrictMode>,
)