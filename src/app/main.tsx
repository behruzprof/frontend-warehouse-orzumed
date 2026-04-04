import { createRoot } from 'react-dom/client'
import Providers from './providers'

import "./styles/app.scss"

createRoot(document.getElementById('root')!).render(
  <Providers />
)
