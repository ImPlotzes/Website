![GitHub repo size](https://img.shields.io/github/repo-size/ImPlotzes/Website)
![Lines of code](https://img.shields.io/tokei/lines/github.com/ImPlotzes/Website)
# Website
 This is the source code for the website at https://plotzes.ml. It is mostly centred around getting TNT Wizards information. The following pages are available:
 - Home
 - TNT Wizards
	 - Stats
	 - Player count
	 - Leaderboard
 - About
<br />
<br />

## Home
 [Link](https://plotzes.ml)  
 This is the main page. It's still in development so there's not much to see right now.
<br />
<br />

## TNT Wizards
 ### Stats
 [Link](https://plotzes.ml/stats)  
 This page can show you account information of a player and also their TNT Wizards statistics. These are the currently available statistics:
 - Username: [USERNAME]
 - **Account information**
  - Account creation date: [DD/MM/YYYY] or "Couldn't accurately approximate account creation date"
  - UUID: [UUID]
  - **Username history**
    - Username: [USERNAME]
    - Since: ----
    - =====================================
    - Username: [USERNAME]
    - Since: [TIME IN LOCAL FORMAT]
    - =====================================
    - *etc.*
  - **Skin**
    - Custom skin: [BOOLEAN]
    - Slim: [BOOLEAN]
    - URL: http://textures.minecraft.net/texture/[RANDOM-CHARACTERS]
 - **Wizards statistics**
  - Total Kills: [NUMBER]
  - Total Deaths: [NUMBER]
  - Total Assists: [NUMBER]
  - Kill Death ratio: [NUMBER]
  - Wins: [NUMBER]
  - Selected class: [CLASS] Wizard
  - **General**
    - Captured points: [NUMBER]
    - Air time: [NUMBER] hours, [NUMBER] minutes, [NUMBER] seconds
    - TNT Games coins: [NUMBER]
    - TNT Games playtime: [NUMBER] hours, [NUMBER] minutes
  - **Settings**
    - Show tip holograms: [BOOLEAN]
    - Show cooldown notifications: [BOOLEAN]
    - Show prestige cosmetics: [BOOLEAN]
    - Show actionbar: [BOOLEAN]
  - **Classes**
    - **[CLASS]**
      - Kills: [NUMBER]
      - Deaths: [NUMBER]
      - Assists: [NUMBER]
      - Kill Death ratio: [NUMBER]
      - Hearts healed: [NUMBER]
      - Damage taken: [NUMBER]
      - Power level: [NUMBER]/6
      - Mana regen level: [NUMBER]/6
      - Prestige: [BOOLEAN]
    - **[CLASS]**
      - Kills: [NUMBER]
      - Deaths: [NUMBER]
      - Assists: [NUMBER]
      - Kill Death ratio: [NUMBER]
      - Hearts healed: [NUMBER]
      - Damage taken: [NUMBER]
      - Power level: [NUMBER]/6
      - Mana regen level: [NUMBER]/6
      - Prestige: [BOOLEAN]
    - *etc.*
<br />
<br />

 ### Player count
 [Link](https://plotzes.ml/wizcount)  
 This page will show you the current amount of players who are playing TNT Wizards. It will also show you the player count history recorded at the database nearest to you in a neat resizable graph.
<br />
<br />

 ### Leaderboard
 [Link](https://plotzes.ml/leaderboard)  
 Every player who gets entered in the [stats page](https://plotzes.ml/stats) with TNT Wizards stats will get added to the leaderboard. It currently has over 270 entries. You can order the leaderboard based on different TNT Wizards stats. Currently you can order by the following stats:
  - Total Kills (default)
  - Wizards Wins
  - Captured Points
  - Ancient Kills
  - Blood Kills
  - Fire Kills
  - Hydro Kills
  - Ice Kills
  - Kinetic Kills
  - Storm Kills
  - Toxic Kills

 The leaderboard is a table that exists of four columns. The first column is a number that shows you the rank of the player. The second column is the player name. If you click on the name then you will go to their stats page. The third column will show the select stat from the selector. The fourth, and last, column shows you the time since their last update. If you want to update someone's position on the leaderboard then you only have to go to their stats page. Every 30 minutes, between 12:00 UTC and 23:59 UTC, it will automatically update the stats of the five players who've been updated the longest ago.
<br />
<br />

## About
  [Link](https://plotzes.ml/about)  
  On this page you'll find cards with information about me and the website. This isn't interactive, but just for information.
