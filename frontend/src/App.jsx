import { Provider } from "react-redux";
import { store } from "./store";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider"
import {
  SidebarProvider,
} from "@/components/ui/sidebar";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <SidebarProvider>
            <BrowserRouter>{router}</BrowserRouter>
          </SidebarProvider>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
