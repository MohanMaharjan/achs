// components/Navbar.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaTimes, FaBars } from "react-icons/fa"; // Added FaBars for hamburger

const Navbar = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const scrollContainerRef = useRef(null);

  // Navigation data (unchanged)
  const navItems = [
    {
      name: "Products",
      submenu: [
        {
          title: "Oracle Cloud Infrastructure",
          items: [
            { name: "OCI Overview", href: "/cloud/" },
            { name: "AI and Machine Learning", href: "/artificial-intelligence/" },
            { name: "Analytics", href: "/business-analytics/" },
            { name: "Billing and Cost Management", href: "/cloud/cost-management-and-governance/" },
            { name: "Compute", href: "/cloud/compute/" },
            { name: "Database Services", href: "/database/" },
            { name: "Developer Services", href: "/application-development/" },
            { name: "Distributed Cloud and Multicloud", href: "/cloud/distributed-cloud/" },
            { name: "Governance and Administration", href: "/cloud/cost-management-and-governance/" },
            { name: "Identity and Security", href: "/security/cloud-security/" },
            { name: "Integration", href: "/integration/" },
            { name: "Migration and Disaster Recovery Services", href: "/cloud/compute/virtual-machines/migration/" },
            { name: "Networking and Connectivity", href: "/cloud/networking/" },
            { name: "Observability and Management", href: "/manageability/" },
            { name: "Storage", href: "/cloud/storage/" },
          ],
        },
        {
          title: "Oracle Cloud Applications",
          items: [
            { name: "Applications Overview", href: "/applications/" },
            {
              name: "Enterprise Resource Planning (ERP)",
              href: "/erp/",
              subitems: [
                { name: "Financial Management", href: "/erp/financials/" },
                { name: "Procurement", href: "/erp/procurement/" },
                { name: "Project Management", href: "/erp/project-portfolio-management-cloud/" },
                { name: "Risk Management and Compliance", href: "/erp/risk-management/" },
                { name: "Enterprise Performance Management", href: "/performance-management/" },
              ],
            },
            {
              name: "Supply Chain & Manufacturing (SCM)",
              href: "/scm/",
              subitems: [
                { name: "Supply Chain Planning", href: "/scm/supply-chain-planning/" },
                { name: "Inventory Management", href: "/scm/inventory-management/" },
                { name: "Manufacturing", href: "/scm/manufacturing/" },
                { name: "Maintenance", href: "/scm/maintenance/" },
                { name: "Product Lifecycle Management", href: "/scm/product-lifecycle-management/" },
                { name: "More SCM applications", href: "/scm/" },
              ],
            },
            {
              name: "Human Capital Management (HCM)",
              href: "/human-capital-management/",
              subitems: [
                { name: "Human Resources", href: "/human-capital-management/hr/" },
                { name: "Talent Management", href: "/human-capital-management/talent-management/" },
                { name: "Workforce Management", href: "/human-capital-management/workforce-management/" },
                { name: "Payroll", href: "/human-capital-management/payroll/" },
              ],
            },
            { name: "Fusion Data Intelligence Platform", href: "/business-analytics/fusion-data-intelligence-platform/" },
            { name: "NetSuite", href: "https://www.netsuite.com/portal/home.shtml" },
            {
              name: "Customer Experience (CX)",
              href: "/cx/",
              subitems: [
                { name: "Marketing", href: "/cx/marketing/" },
                { name: "Sales", href: "/cx/sales/" },
                { name: "Service", href: "/cx/service/" },
              ],
            },
            { name: "Advertising (Data Cloud)", href: "/advertising/" },
            { name: "Oracle Marketplace", href: "https://cloudmarketplace.oracle.com/marketplace/en_US/homePage.jspx" },
          ],
        },
        {
          title: "Hardware and Software",
          items: [
            { name: "Java", href: "/java/" },
            { name: "Oracle Database", href: "/database/technologies/" },
            { name: "MySQL", href: "/mysql/enterprise/" },
            { name: "Linux", href: "/linux/" },
            { name: "NoSQL", href: "/database/nosql/" },
            { name: "On-Premises Applications", href: "/applications/on-premise-products/#on-premises" },
            { name: "All Software", href: "/products/software.html" },
            { name: "Servers and Storage", href: "/it-infrastructure/" },
            { name: "Exadata", href: "/engineered-systems/exadata/" },
          ],
        },
      ],
    },
    { name: "Industries", href: "#" },
    { name: "Resources", href: "#" },
    { name: "Customers", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Developers", href: "#" },
    { name: "Company", href: "#" },
  ];

  // Mega menu animation variants
  const megaMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Scroll handling
  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -100, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-[#c91313] shadow-lg !z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between z-50">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Dream
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation Menu */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <div
                className="flex items-center cursor-pointer"
                onClick={() =>
                  setIsMegaMenuOpen(isMegaMenuOpen === index ? null : index)
                }
              >
                <Link
                  href={item.href || "#"}
                  className="text-white hover:text-orange-500 transition-colors duration-200"
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <span className="ml-1 text-white group-hover:text-orange-500">
                    {isMegaMenuOpen === index ? (
                      <FaChevronUp size={12} />
                    ) : (
                      <FaChevronDown size={12} />
                    )}
                  </span>
                )}
              </div>

              {/* Desktop Mega Menu */}
              {item.submenu && (
                <AnimatePresence>
                  {isMegaMenuOpen === index && (
                    <motion.div
                      variants={megaMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="fixed left-0 top-[64px] w-full bg-white shadow-lg z-40"
                    >
                      <div className="relative">
                        <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {item.name}
                          </h2>
                          <button
                            onClick={() => setIsMegaMenuOpen(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <FaTimes size={20} />
                          </button>
                        </div>
                        <button
                          onClick={scrollUp}
                          className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <FaChevronUp size={16} className="text-gray-600" />
                        </button>
                        <div
                          ref={scrollContainerRef}
                          className="container mx-auto px-4 py-12 max-h-[70vh] overflow-y-auto"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {item.submenu.map((category, catIndex) => (
                              <div key={catIndex} className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {category.title}
                                </h3>
                                <ul className="space-y-2">
                                  {category.items.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                      <Link
                                        href={subItem.href}
                                        className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                                      >
                                        {subItem.name}
                                      </Link>
                                      {subItem.subitems && (
                                        <ul className="ml-4 mt-1 space-y-1">
                                          {subItem.subitems.map(
                                            (nestedItem, nestedIndex) => (
                                              <li key={nestedIndex}>
                                                <Link
                                                  href={nestedItem.href}
                                                  className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                                >
                                                  {nestedItem.name}
                                                </Link>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={scrollDown}
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <FaChevronDown size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-[#c91313] z-40 md:hidden overflow-y-auto"
          >
            <ul className="flex flex-col items-start gap-4 p-4">
              {navItems.map((item, index) => (
                <li key={index} className="w-full">
                  <div
                    className="flex items-center justify-between cursor-pointer text-white hover:text-orange-500 transition-colors duration-200"
                    onClick={() =>
                      setIsMegaMenuOpen(isMegaMenuOpen === index ? null : index)
                    }
                  >
                    <Link href={item.href || "#"}>{item.name}</Link>
                    {item.submenu && (
                      <span>
                        {isMegaMenuOpen === index ? (
                          <FaChevronUp size={12} />
                        ) : (
                          <FaChevronDown size={12} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  {item.submenu && isMegaMenuOpen === index && (
                    <div className="mt-2 pl-4 space-y-2">
                      {item.submenu.map((category, catIndex) => (
                        <div key={catIndex} className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">
                            {category.title}
                          </h3>
                          <ul className="space-y-1">
                            {category.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.href}
                                  className="text-gray-200 hover:text-orange-500 transition-colors duration-200"
                                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                                >
                                  {subItem.name}
                                </Link>
                                {subItem.subitems && (
                                  <ul className="ml-4 mt-1 space-y-1">
                                    {subItem.subitems.map(
                                      (nestedItem, nestedIndex) => (
                                        <li key={nestedIndex}>
                                          <Link
                                            href={nestedItem.href}
                                            className="text-sm text-gray-300 hover:text-orange-500 transition-colors duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                                          >
                                            {nestedItem.name}
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;