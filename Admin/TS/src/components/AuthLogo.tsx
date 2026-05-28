import Link from 'next/link'

import logoEcoexplora from '@/assets/images/logole1.png'

const AuthLogo = () => {
  return (
    <>
      <Link href="/" className="logo-dark">
        <img src={logoEcoexplora.src} alt="EcoExplora Tumbes" height={40} />
      </Link>
      <Link href="/" className="logo-light">
        <img src={logoEcoexplora.src} alt="EcoExplora Tumbes" height={40} />
      </Link>
    </>
  )
}

export default AuthLogo
