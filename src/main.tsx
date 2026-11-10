import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AppRoutes } from '@/app/router'
import { CartProvider, AuthProvider, PopupProvider } from '@/lib/stores'
import { BlogsProvider } from '@/lib/blogs'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <PopupProvider>
            <BlogsProvider>
              <AppRoutes />
            </BlogsProvider>
          </PopupProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
