import Landingpage from "./components/landingpage";
import WaitingRoom from "./components/waitingroom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ContextProvider } from "./Context";
import Arena from "./components/arena";
import LostPage from "./components/lostPage";
import WonPage from "./components/wonPage";
import Statistics from "./components/statistics";
import About from "./components/about";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Switch>
          <Route path="/waitingroom">
            <WaitingRoom />
          </Route>
          <Route path="/arena">
            <Arena />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/statistics">
            <Statistics />
          </Route>
          <Route path="/won">
            <WonPage />
          </Route>
          <Route path="/lost">
            <LostPage />
          </Route>
          <Route path="/">
            <Landingpage />
          </Route>
        </Switch>
      </Router>
    </ContextProvider>
  );
}

export default App;
