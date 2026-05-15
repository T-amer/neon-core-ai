import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import History from "./pages/History";
import ComponentShowcase from "./pages/ComponentShowcase";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route path="/showcase" component={ComponentShowcase} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;