import "./reset.css";
import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Authorization from "./Authorization/Authorization";
import ReactDOM from "react-dom";
import EmailConfirm from "./EmailConfirm/EmailConfirm";
import Registration from "./Registration/Registration";


export default function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <Routes>
                    <Route
                        exact path="/"
                        element={<Authorization/>}
                    />
                    <Route
                        path="/register"
                        element={<EmailConfirm/>}
                    />
                    <Route
                        exact path="/register/*"
                        element={<Registration/>}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<App/>, document.getElementById('root'));
}
