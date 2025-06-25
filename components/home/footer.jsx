'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const footerBlocks = [
    {
      type: 'text',
      content: {
        image: '/logo-small.webp',
        title: 'Travel further with less.',
        description: 'Effortless travel staples that let you carry less and experience more.'
      }
    },
    {
      type: 'menu',
      title: 'Shop',
      links: [
        { text: 'Travel Tops', href: '/collections/tops' },
        { text: 'Travel Bottoms', href: '/collections/bottoms' },
        { text: 'Bags', href: '/collections/travel-bags' },
        { text: 'Gift Cards', href: '/products/gift-card' }
      ]
    },
    {
      type: 'menu',
      title: 'Explore',
      links: [
        { text: 'About', href: '/pages/about' },
        { text: 'Story', href: '/pages/story' },
        { text: 'Journal', href: '/blogs/journal' },
        { text: 'Ambassadors & Affiliates', href: '/pages/affiliate-promotion' }
      ]
    },
    {
      type: 'menu',
      title: 'Concierge',
      links: [
        { text: 'FAQ', href: '/pages/faq' },
        { text: 'Customer Support', href: '/pages/contact-us' },
        { text: 'Start a Return', href: 'https://western-rise.loopreturns.com/#/' },
        { text: 'Privacy Policy', href: '/policies/privacy-policy' },
        { text: 'Contact', href: '/pages/contact-us' }
      ]
    },
    {
      type: 'menu',
      title: 'Account',
      links: [
        { text: 'Login', href: '/account/login' },
        { text: 'Sign up', href: '/account/register' },
        { text: 'Terms of Service', href: '/policies/terms-of-service' }
      ]
    },
    {
      type: 'newsletter',
      title: 'Sign Up Now!',
      description: 'Get exclusive discounts, plus travel hacks, packing tips and more.'
    }
  ]

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/westernrise',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.183 21.85v-8.868H7.2V9.526h2.983V6.982a4.17 4.17 0 0 1 4.44-4.572 22.33 22.33 0 0 1 2.667.144v3.084h-1.83a1.44 1.44 0 0 0-1.713 1.68v2.208h3.423l-.447 3.456h-2.97v8.868h-3.57Z"/>
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/western_rise',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.94 4h2.715l-5.93 6.777L20.7 20h-5.462l-4.278-5.593L6.065 20H3.35l6.342-7.25L3 4h5.6l3.868 5.113L16.94 4Zm-.952 14.375h1.504L7.784 5.54H6.17l9.818 12.836Z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/western_rise',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2.4c-2.607 0-2.934.011-3.958.058-1.022.046-1.72.209-2.33.446a4.705 4.705 0 0 0-1.7 1.107 4.706 4.706 0 0 0-1.108 1.7c-.237.611-.4 1.31-.446 2.331C2.41 9.066 2.4 9.392 2.4 12c0 2.607.011 2.934.058 3.958.046 1.022.209 1.72.446 2.33a4.706 4.706 0 0 0 1.107 1.7c.534.535 1.07.863 1.7 1.108.611.237 1.309.4 2.33.446 1.025.047 1.352.058 3.959.058s2.934-.011 3.958-.058c1.022-.046 1.72-.209 2.33-.446a4.706 4.706 0 0 0 1.7-1.107 4.706 4.706 0 0 0 1.108-1.7c.237-.611.4-1.31.446-2.33.047-1.025.058-1.352.058-3.959s-.011-2.934-.058-3.958c-.047-1.022-.209-1.72-.446-2.33a4.706 4.706 0 0 0-1.107-1.7 4.705 4.705 0 0 0-1.7-1.108c-.611-.237-1.31-.4-2.331-.446C14.934 2.41 14.608 2.4 12 2.4Zm0 1.73c2.563 0 2.867.01 3.88.056.935.042 1.443.199 1.782.33.448.174.768.382 1.104.718.336.336.544.656.718 1.104.131.338.287.847.33 1.783.046 1.012.056 1.316.056 3.879 0 2.563-.01 2.867-.056 3.88-.043.935-.199 1.444-.33 1.782a2.974 2.974 0 0 1-.719 1.104 2.974 2.974 0 0 1-1.103.718c-.339.131-.847.288-1.783.33-1.012.046-1.316.056-3.88.056-2.563 0-2.866-.01-3.878-.056-.936-.042-1.445-.199-1.783-.33a2.974 2.974 0 0 1-1.104-.718 2.974 2.974 0 0 1-.718-1.104c-.131-.338-.288-.847-.33-1.783-.047-1.012-.056-1.316-.056-3.879 0-2.563.01-2.867.056-3.88.042-.935.199-1.443.33-1.782.174-.448.382-.768.718-1.104a2.974 2.974 0 0 1 1.104-.718c.338-.131.847-.288 1.783-.33C9.133 4.14 9.437 4.13 12 4.13Zm0 11.07a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm0-8.13a4.93 4.93 0 1 0 0 9.86 4.93 4.93 0 0 0 0-9.86Zm6.276-.194a1.152 1.152 0 1 1-2.304 0 1.152 1.152 0 0 1 2.304 0Z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      href: 'https://www.youtube.com/c/WesternRise',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M20.44 5.243c.929.244 1.66.963 1.909 1.876.451 1.654.451 5.106.451 5.106s0 3.452-.451 5.106a2.681 2.681 0 0 1-1.91 1.876c-1.684.443-8.439.443-8.439.443s-6.754 0-8.439-.443a2.682 2.682 0 0 1-1.91-1.876c-.45-1.654-.45-5.106-.45-5.106s0-3.452.45-5.106a2.681 2.681 0 0 1 1.91-1.876c1.685-.443 8.44-.443 8.44-.443s6.754 0 8.438.443Zm-5.004 6.982L9.792 15.36V9.091l5.646 3.134Z"/>
        </svg>
      )
    }
  ]

  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="footer__wrapper flex flex-col lg:flex-row gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Footer Blocks */}
          <div className="footer__block-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {footerBlocks.map((block, index) => (
              <motion.div
                key={index}
                className={`footer__block footer__block--${block.type}`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {block.type === 'text' && (
                  <div className="space-y-4">
                    <div className="footer__block-image">
                      <Image
                        src="/achs.png"
                        alt="Logo"
                        width={120}
                        height={40}
                        className="w-auto h-10"
                      />
                    </div>
                    <h3 className="text-xl font-medium">{block.content.title}</h3>
                    <p className="text-gray-600">{block.content.description}</p>
                  </div>
                )}

                {block.type === 'menu' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">{block.title}</h4>
                    <ul className="space-y-2">
                      {block.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link 
                            href={link.href}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {link.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {block.type === 'newsletter' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">{block.title}</h4>
                    <p className="text-gray-600">{block.description}</p>
                    <form className="mt-4">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <input
                          type="email"
                          placeholder="Your email"
                          className="flex-grow px-4 py-2 focus:outline-none"
                          required
                        />
                        <button 
                          type="submit"
                          className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                        >
                          <svg width="5" height="8" viewBox="0 0 5 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="m.75 7 3-3-3-3"/>
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Aside */}
        <motion.div 
          className="footer__aside mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="footer__aside-top flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <ul className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-black transition-colors"
                    aria-label={`Follow on ${social.name}`}
                  >
                    {social.icon}
                  </Link>
                </motion.li>
              ))}
            </ul>

           
          </div>

          {/* Copyright */}
          <motion.div 
            className="footer__aside-bottom mt-8 text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} All Rights Reserved</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer