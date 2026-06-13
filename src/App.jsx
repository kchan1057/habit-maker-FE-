import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import OAuthCallback from './pages/OAuthCallback'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import RoutineRegister from './pages/RoutineRegister'
import Today from './pages/Today'
import Tracker from './pages/Tracker'
import Stats from './pages/Stats'
import Recommend from './pages/Recommend'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/routines/new" element={<RoutineRegister />} />
            <Route path="/today" element={<Today />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/recommend" element={<Recommend />} />
        </Routes>
    )
}

export default App
