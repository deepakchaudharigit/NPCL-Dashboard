'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Squares2X2Icon, 
  DocumentTextIcon,
  CogIcon,
  PowerIcon
} from '@heroicons/react/24/outline'
import { LogoutButton } from '@/components/auth/LogoutButton'

export function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Squares2X2Icon,
      current: pathname === '/dashboard'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: DocumentTextIcon,
      current: pathname === '/reports'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      current: pathname.startsWith('/settings')
    }
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 z-50 p-0 transform -translate-x-full md:translate-x-0 transition-transform duration-300 shadow-lg md:shadow-none">
      {/* Logo Section */}
      <div className="px-3 py-4 border-b border-gray-100">
        <div className="flex items-center justify-center px-4 py-3 mx-3 rounded-lg bg-gray-50">
          <Image
            src="/logo.png"
            alt="NPCL Logo"
            width={120}
            height={32}
            className="object-contain max-w-full max-h-full"
            priority
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 py-4">
        <ul className="space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 mx-3
                    ${item.current
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-5 w-5 flex-shrink-0
                      ${item.current ? 'text-white' : 'text-gray-400'}
                    `}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-3 right-3">
        <LogoutButton className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
          <PowerIcon className="h-4 w-4" />
          Logout
        </LogoutButton>
      </div>
    </div>
  )
}