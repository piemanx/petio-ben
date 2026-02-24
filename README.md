# Petio 0.5.7 (Modernized)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react">
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-blue?logo=docker">
</p>

<p align="center">
  <a href="https://discord.gg/bseGmrUd3N" target="_blank"><img src="https://img.shields.io/discord/722180802871427104?label=Discord"></a>
  <a href="https://www.reddit.com/r/Petio/" target="_blank"><img src="https://img.shields.io/reddit/subreddit-subscribers/petio?label=Reddit"></a>
</p>

Request, review and discover companion app for plex.

Allow your users to interact with media both on and off your server with this app. Available as a docker image and also as binaries. Features a React frontend utilizing Redux and a Node JS express API and MongoDb database.

## Modernization Status
This repository has been modernized from the original Petio codebase.
- **Runtime:** Updated to **Node.js 20** (LTS).
- **Frontend:** Upgraded to **React 18** and migrated to **Vite** for faster builds.
- **Architecture:** Key components refactored to **Functional Components** with Hooks.
- **Testing:** Added **Vitest** for backend testing and **ESLint** for code quality.
- **Docker:** Optimized multi-stage `Dockerfile` for smaller, secure builds.

## Get Started

### 1. Docker (Recommended)
The Docker image is now built using a multi-stage process. You can build it locally or pull it if available.

```bash
docker build -t petio:latest .
docker run -d -p 7777:7777 --name petio petio:latest
```

### 2. Local Development
**Prerequisites:** Node.js 20+, MongoDB.

**Setup:**
```bash
# Install dependencies
npm install
cd api && npm install
cd ../frontend && npm install
cd ../admin && npm install

# Start (Runs API + Frontend Proxy)
npm start
```

## Documentation
- [Technical Documentation](TECHNICAL_DOC.md): Architecture, project structure, and refactoring details.
- [Todo](TODO.md): Remaining tasks and roadmap.

<h2>Credits</h2>
<h4>Attribution Credits</h4>
<p><a target="_blank" href="https://www.themoviedb.org/"><img height="15px" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/> The Movie Database (Data Source)</a></p>
<p><a target="_blank" href="https://fanart.tv/"><img height="15px" src="https://fanart.tv/wp-content/uploads/2020/08/cropped-logo-32x32.png"/> Fanart.tv (Extra visual assets)</a></p>
<p><a target="_blank" href="https://fontawesome.com/"><img height="15px" src="https://fontawesome.com/images/favicons/favicon-16x16.png"/> Font Awesome (SVG Icon Assets)</a></p>
<p><a target="_blank" href="https://www.imdb.com"><img height="15px" src="https://m.media-amazon.com/images/G/01/IMDb/BG_rectangle._CB1509060989_SY230_SX307_AL_.png"/> Information courtesy of IMDb. Used with permission.</a></p>

<h4>Special Thanks to:</h4>
<p><a target="_blank" href="https://github.com/vertig0ne">vertig0ne</a></p>
<p><a target="_blank" href="https://github.com/leram84">leram84</a></p>
<p><a target="_blank" href="https://github.com/angrycuban13">angrycuban13</a></p>

<h4>Thanks to:</h4>
<p><a target="_blank" href="https://github.com/RyleaStark">RyleaStark</a></p>
<p><a target="_blank" href="https://github.com/danshilm">danshilm</a></p>
<p><a target="_blank" href="https://github.com/MasterFrexe">Frexe</a></p>
<p><a target="_blank" href="https://github.com/PotentialIngenuity">PotentialIngenuity</a></p>

<h2>License</h2>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This application is no way endorsed by Plex, TheMovieDb, IMDb or any other third party resources utilized within this application.

<h2>Sponsors</h2>
<p><a target="_blank" href="https://versobit.com/"><img src="https://versobit.com/img/logos/logo_black_50h.svg" height="30px" /></a></p>
<p>Want to sponsor this project? <a target="_blank" href="https://discord.gg/bseGmrUd3N">Get in touch on Discord</a></p>
