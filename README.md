      ============================================================
      How to Run This Project (Frontend + Backend Setup)
      ============================================================

       1. Start the json-server backend (API server):
       --------------------------------------------
       a) Make sure you have installed json-server:
       b) Start the server by running:
            npm run start:server

            This will make the API available at:
            http://localhost:3000/recipes

        2. Start the frontend (open the index.html file):
        -----------------------------------------------
        a) (If you have "Live Server" extension installed in VSCode:)
           - Right-click on index.html → "Open with Live Server
        b) Note: to prevent page refreshing upon POST or DELETE operations, 
          you will need to update the Live Server settings to ignore .json:
          i.e. adding this property to the ignoreFiles setting:
          "liveServer.settings.ignoreFiles": [
            "**/*.json",
