"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { useTheme } from "../../utils/contexts/themeContext"
import SpaceContainer from "./SpaceContainer"
import SettingsManager from "./SettingsManager"
import CreateSpaceButton from "../../components/Misc/CreateSpaceButton"
import styles from "./NavDrawer.module.css"

const NavBar = () => {
  const { theme, colors } = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeWorkspace, setActiveWorkspace] = useState(null)

  const { user } = useSelector((state) => state.auth)
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace)

  useEffect(() => {
    if (currentWorkspace) {
      setActiveWorkspace(currentWorkspace)
    }
  }, [currentWorkspace])

  const handleLogout = () => {
    dispatch({ type: "auth/logout" })
    router.push("/login")
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <motion.div
      className={`${styles.navDrawer} ${isCollapsed ? styles.collapsed : ""}`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: `linear-gradient(180deg, ${colors.bgSecondary} 0%, ${colors.bgPrimary} 100%)`,
        borderRight: `1px solid ${colors.borderColor}`,
      }}
    >
      {/* Header */}
      <div className={styles.navHeader}>
        <motion.div className={styles.logo} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className={styles.logoIcon}>
            <span className="gradient-text">Z</span>
          </div>
          {!isCollapsed && (
            <motion.div
              className={styles.logoText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="gradient-text">DigitalZ</h2>
              <span className={styles.subtitle}>Organizer</span>
            </motion.div>
          )}
        </motion.div>

        <motion.button
          className={styles.collapseBtn}
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ color: colors.primary }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d={isCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
          </svg>
        </motion.button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <motion.div
          className={styles.userInfo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.userAvatar}>
            <div className={styles.avatarCircle} style={{ background: colors.primary }}>
              {user?.userEmail?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className={styles.userDetails}>
            <h4>{user?.userEmail}</h4>
            <span className={styles.userRole}>Organizador</span>
          </div>
        </motion.div>
      )}

      {/* Workspace Selector */}
      <div className={styles.workspaceSection}>
        <SettingsManager collapsed={isCollapsed} />
      </div>

      {/* Spaces Container */}
      <div className={styles.spacesContainer}>
        <SpaceContainer collapsed={isCollapsed} />
      </div>

      {/* Create Space Button */}
      <div className={styles.createSpaceContainer}>
        <CreateSpaceButton collapsed={isCollapsed} />
      </div>

      {/* Footer */}
      <motion.div
        className={styles.navFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {!isCollapsed && (
          <div className={styles.footerContent}>
            <div className={styles.version}>
              <span>DigitalZ Organizer v2.0</span>
            </div>
            <motion.button
              className={styles.logoutBtn}
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, ${colors.error} 0%, #cc3333 100%)`,
                color: "white",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Sair
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default NavBar
