import Footer from './components/Footer'
import Header from './components/Header'
import './styles/styles.css'

export default function RootLayout({
  children,showHeader
}: {
  children: React.ReactNode,
  showHeader: boolean,
}) {
  return (
    <html lang="en">
      {showHeader && <Header></Header>}
      <body style={{  marginLeft: '20px', marginRight: '20px'}}>
        {children}
      </body>
      <Footer></Footer>
    </html>
  )
}
