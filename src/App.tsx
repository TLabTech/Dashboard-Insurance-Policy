import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Button } from './components/ui/button'

import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import { RouterProvider } from 'react-router'

import { router } from './router'
import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
