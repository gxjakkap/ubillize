import Image from 'next/image'

interface BankLogoProps {
    bankCode: string,
    className?: string
}

const BankLogo = ({ bankCode, className }: BankLogoProps) => {
  const logoPath = `/banks/${bankCode}.svg`

  return (
    <Image 
        src={logoPath} 
        alt={`${bankCode} logo`} 
        width={50}
        height={50}
        className={className}
    />
  )
}

export default BankLogo
