import Footer from './components/Footer'
import Header from './components/Header'
import './styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Header></Header>
      <body>
        {children}
      </body>
      <Footer></Footer>
    </html>
  )
}
