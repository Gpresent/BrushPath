import Header from './components/Header'
import './styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
    <Header></Header>
        {children}
      </body>
    </html>
  )
}
