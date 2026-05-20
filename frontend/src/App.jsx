import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import OAuthCallback from './pages/OAuthCallback'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    )
}

export default App