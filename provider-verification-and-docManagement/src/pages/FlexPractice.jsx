import { useEffect, useState } from 'react'
import { Box, Drawer, IconButton, Typography, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import QuickActions from '../components/QuickActions'
import ViewProviders from './ViewProviders'

// const NAVBAR_HEIGHT = "15%"

const FlexPractice = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMediumUp = useMediaQuery("(min-width:900px)")

  useEffect(() => {
    if (isMediumUp) {
      setDrawerOpen(false)
    }
  }, [isMediumUp])

  return (
    <>
    <Box
    sx={{
      width : "100%" ,
      height: "100vh",
      minHeight: "100vh" ,
      display : "flex" ,
      flexDirection : "column"
    }}>
      <Box
        className="navbarMain"
        sx={{
          height: "13%",
          width: "100%",
          bgcolor: "primary.main",
          border: "2px solid rgba(7, 7, 7, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          boxSizing: "border-box",
        }}
      >
        <Box
          className="left"
          sx={{
            width: { xs: "25%", sm: "25%" },
            height: "50%",
            display: "flex",
            alignItems: "center",
            
            m: 1,
            border: "2px solid rgba(7, 7, 7, 0.45)",
          }}
        >
          <Box sx={{ m: 1 }}>
            left
          </Box>
        </Box>
        <Box
          className="middle"
          sx={{
            width: { xs: "30%", sm: "30%" },
            height: "50%",
             m: 2,
            border: "2px solid rgba(7, 7, 7, 0.45)",
            display: {
                md: "inline-flex",
                sm: "none",
                xs: "none",
              } ,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          middle
        </Box>
        <Box
          className="right"
          sx={{
            width: { xs: "25%", sm: "25%" },
            height: "50%",
             m: 2,
            border: "2px solid rgba(7, 7, 7, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 1,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ 
            m: 1 
            }}>
            right</Box>
          <IconButton
            aria-label="Open menu"
            size="medium"
            onClick={() => setDrawerOpen(true)}
            sx={{
            //   m: 1,

              display: {
                xs: "inline-flex",
                sm: "inline-flex",
                md: "none",
              } ,
              flexShrink: 0,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>
      <Box aria-hidden="true" sx={{ height: "15%", flexShrink: 0 }} />
      {/* Main content */}
      <Box
        className="mainContent"
        sx={{
          width: "100%",
        //   flex: 1,
          p: 2,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",alignItems: "center",
          flexWrap: "wrap",
          
          gap: 2,
        }}
      >
        <Box
          className="contentBox-1"
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 500,
            width : "100%" ,
            minWidth: "80%",
            minHeight: {
                sm:650,
                xs: 550,
                lg: 700,
            },
            height: {
                xs:"20vh" ,
                sm:"30vh" ,
            },
            border: "2px solid rgba(7, 7, 7, 0.45)",
          }}
        >
          <QuickActions />
        </Box>
        <Box
          className="contentBox-2"
          sx={{ width: "100%", minHeight: 120,flexGrow: 1,flexShrink: 1, border: "2px solid rgba(7, 7, 7, 0.45)" }}
        >
          <ViewProviders />
        </Box>
        <Box
          className="contentBox-3"
          sx={{ minHeight: 160,flexGrow: 1,flexShrink: 1, border: "2px solid rgba(7, 7, 7, 0.45)" }}
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, illum!
        </Box>
        <Box
          className="contentBox-4"
          sx={{ minHeight: 160,flexGrow: 1,flexShrink: 1, border: "2px solid rgba(7, 7, 7, 0.45)" }}
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, obcaecati?
        </Box>
        <Box
          className="contentBox-5"
          sx={{ minHeight: 160,flexGrow: 1,flexShrink: 1, border: "2px solid rgba(7, 7, 7, 0.45)" }}
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia iusto sit consequatur eum asperiores reiciendis dolor adipisci nulla necessitatibus, qui voluptates alias vitae, ratione illo, unde aliquid iure. Cum temporibus, consequatur beatae accusantium ratione architecto autem dolorem possimus repudiandae voluptatum.
        </Box>
        
      </Box>
      </Box>
    <Drawer
      anchor="right"
      open={drawerOpen && !isMediumUp}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: {
        xs: 200, sm: 270 
      }, p: 2 }} role="presentation">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Menu</Typography>
          <IconButton
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>Sidebar content</Typography>
      </Box>
    </Drawer>
    </>
  )
}

export default FlexPractice