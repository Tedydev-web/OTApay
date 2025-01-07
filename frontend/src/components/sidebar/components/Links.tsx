/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from 'components/link/NavLink';
import DashIcon from 'components/icons/DashIcon';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

// Refined animations with better performance
const menuAnimation = {
  hidden: {
    height: 0,
    opacity: 0,
    translateY: -10,
    transition: {
      height: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      },
      opacity: {
        duration: 0.15,
        ease: "linear" 
      },
      translateY: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  show: {
    height: "auto",
    opacity: 1,
    translateY: 0,
    transition: {
      height: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      },
      opacity: {
        duration: 0.15, 
        ease: "linear"
      },
      translateY: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }
};

const itemAnimation = {
  hidden: {
    opacity: 0,
    translateX: -8,
  },
  show: {
    opacity: 1,
    translateX: 0,
  }
};

const glowAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 1, 0], transition: { duration: 2, repeat: Infinity } }
};

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  const pathname = usePathname();
  const { routes } = props;
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({});
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [clickedMenu, setClickedMenu] = useState<string | null>(null);

  // Auto expand active menu
  useEffect(() => {
    routes.forEach(route => {
      if (route.children?.some(child => pathname?.includes(child.path))) {
        setOpenMenus(prev => ({...prev, [route.path]: true}));
      }
    });
  }, [pathname, routes]);

  const activeRoute = useCallback(
    (routeName: string) => pathname?.includes(routeName),
    [pathname]
  );

  const toggleMenu = (path: string) => {
    setClickedMenu(path);
    setOpenMenus(prev => ({...prev, [path]: !prev[path]}));
    
    // Reset click effect
    setTimeout(() => setClickedMenu(null), 300);
  };

  const createLinks = (routes: RoutesType[]) => {
    return routes.map((route, index) => {
      if (route.layout === '/admin') {
        const hasChildren = route.children && route.children.length > 0;
        const isOpen = openMenus[route.path];
        const isActive = activeRoute(route.path);
        const isHovered = hoveredMenu === route.path;
        const isClicked = clickedMenu === route.path;

        return (
          <div key={index} className="mb-3 select-none">
            <motion.div 
              className={`group relative flex cursor-pointer items-center rounded-2xl px-4 py-3
                backdrop-blur-lg transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-brand-600/90 to-brand-400/90 text-white shadow-lg shadow-brand-500/20' 
                  : 'hover:bg-white/10 dark:hover:bg-navy-700/40'
                }
                ${isHovered && !isActive ? 'bg-white/5 dark:bg-navy-800/40' : ''}
                ${isClicked ? 'scale-95' : ''}
              `}
              onClick={() => hasChildren && toggleMenu(route.path)}
              onHoverStart={() => setHoveredMenu(route.path)}
              onHoverEnd={() => setHoveredMenu(null)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/20 to-brand-400/20 blur-xl"
                  variants={glowAnimation}
                  initial="initial"
                  animate="animate"
                />
              )}

              <motion.span 
                className={`flex items-center ${isActive ? 'text-white' : 'text-navy-700 dark:text-white'}`}
                initial={false}
                animate={{ 
                  x: isOpen ? 4 : 0,
                  scale: isActive ? 1.02 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl
                  transition-colors duration-300 group-hover:bg-white/10
                  ${isActive ? 'bg-white/20' : 'bg-navy-50 dark:bg-navy-800/40'}
                `}>
                  {route.icon ? route.icon : <DashIcon />}
                </span>
                <span className="ml-3 font-medium tracking-wide">{route.name}</span>
              </motion.span>
              
              {hasChildren && (
                <motion.div 
                  animate={{ 
                    rotate: isOpen ? 180 : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="ml-auto"
                >
                  <MdKeyboardArrowDown 
                    className={`h-6 w-6 transition-all duration-300
                      ${isActive ? 'text-white' : 'text-gray-600 dark:text-white'}
                      ${isHovered ? 'text-brand-500 dark:text-brand-400' : ''}
                    `}
                  />
                </motion.div>
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -right-px top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>

            {/* Submenu */}
            <AnimatePresence mode="sync">
              {hasChildren && isOpen && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={menuAnimation}
                  className="overflow-hidden transform-gpu"
                  style={{ 
                    transformOrigin: "top",
                    willChange: "transform, opacity",
                  }}
                >
                  <motion.div
                    className="relative ml-8 mt-2 space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeOut",
                      delay: 0.1 
                    }}
                  >
                    {route.children.map((child, childIndex) => (
                      <NavLink key={childIndex} href={child.layout + '/' + child.path}>
                        <motion.div
                          variants={{
                            hidden: { 
                              x: -10,
                              opacity: 0,
                            },
                            show: {
                              x: 0,
                              opacity: 1,
                              transition: {
                                duration: 0.3,
                                ease: [0.34, 1.56, 0.64, 1],
                                delay: childIndex * 0.06
                              }
                            }
                          }}
                          className={`group relative flex cursor-pointer items-center rounded-xl
                            px-4 py-2 transition-all duration-300 
                            ${activeRoute(child.path)
                              ? 'bg-gradient-to-r from-brand-400/10 via-brand-500/10 to-transparent text-brand-500 font-medium'
                              : 'hover:bg-gray-50/30 dark:hover:bg-navy-700/30'
                            }
                            hover:pl-5
                          `}
                          style={{
                            backfaceVisibility: "hidden"
                          }}
                        >
                          {/* Decorative dot */}
                          <div className={`absolute left-0 h-1.5 w-1.5 rounded-full 
                            transition-all duration-300
                            ${activeRoute(child.path)
                              ? 'bg-brand-500 scale-100'
                              : 'bg-gray-400/50 scale-75 group-hover:scale-100 group-hover:bg-brand-400'
                            }
                          `}/>

                          {/* Label */}
                          <span className={`ml-3 text-ml tracking-wide transition-all duration-300
                            ${activeRoute(child.path)
                              ? 'text-brand-500 font-semibold'
                              : 'text-gray-800 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                            }
                          `}>
                            {child.name}
                          </span>

                          {/* Active highlight */}
                          {activeRoute(child.path) && (
                            <motion.div
                              layoutId="activeSubmenuHighlight"
                              className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-400/10 via-brand-500/5 to-transparent"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                              }}
                            />
                          )}

                          {/* Hover glow effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-400/0 to-transparent opacity-0 
                            transition-opacity duration-300 group-hover:opacity-100"/>
                        </motion.div>
                      </NavLink>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }
    });
  };

  return (
    <motion.div 
      className="px-4 pt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {createLinks(routes)}
    </motion.div>
  );
};

export default SidebarLinks;
