# Superlit Frontend

## What's Superlit?

- Superlit is a code submission and evaluation platform tailored towards universities.
- We aim to eliminate plagiarism in code assignments and tests
- We include advance features for plagiarism detection. A full list will be published here after completion

### Installation & Development

#### Setup With Docker

1. populate the `.env` file. a template is provided in `.env.example`

note: everything in the `.env` file and the private key are a secret and are not supposed to be shared.

2. Clone the [backend](https://github.com/anuragrao04/superlit-backend) as well and place it adjacent to this directory:

```bash
project-root/
├── superlit-backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── ... (other backend files)
├── superlit-frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   └── ... (frontend source files)
│   ├── nginx/
│   │   └── nginx.conf
│   └── ... (other frontend files)
```

Note: make sure to populate `.env` in the backend repository as well

3. Run `docker-compose up` while your current working directory is the `project-root/superlit-backend`

4. You'll find the website running at `http://localhost`


#### Setup Without Docker

- Install a recent version of `node (>18)`
- clone this repository

```bash
git clone https://github.com/anuragrao04/superlit-frontend
```

- `cd` into the repository

```bash
cd superlit-frontend
```

- Copy `.env.example` to a new file `.env` and fill out the fields there
- Install the dependencies and run the development server

```bash
npm i
npm run dev
```

- You should find the website running on `http://localhost:5173`
