import themeColors from "../../../utils/contexts/themeContext"
import ViewForItem from "./ViewForItem"
import ViewList from "./ViewList"

function HeaderBar({ activeView, setActiveView }) {
  const styles = {
    display: "flex",
    flexDirection: "row",
    background: themeColors.backgroundSecondary,
    borderBottom: `1px solid ${themeColors.cardBorder}`,
    padding: "16px 24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  }

  return (
    <div style={styles}>
      <ViewForItem />
      <ViewList activeView={activeView} setActiveView={setActiveView} />
    </div>
  )
}

export default HeaderBar
