# Contributing to Nature Tek Solar CGMS

First off, thanks for taking the time to contribute! 🎉

## Branching Strategy

We use a standard branching workflow:

- `main`: The stable, production-ready branch. Do not push directly to `main`.
- Feature branches: Created off `main`, named according to the convention below.

### Branch Naming Convention

- `feat/`: For new features (e.g., `feat/add-payment-gateway`)
- `fix/`: For bug fixes (e.g., `fix/auth-token-refresh`)
- `chore/`: For maintenance tasks, dependency updates, and refactoring (e.g., `chore/update-react`)
- `docs/`: For documentation updates

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This allows us to automatically generate changelogs and version bumps.

**Format:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

**Example:**
```
feat(auth): add OAuth2 login support

Fixes #123
```

## Pull Request Process

1. Ensure all tests and linting pass locally (`npm run test`, `npm run lint`).
2. Update the README or relevant documentation if your change introduces new functionality.
3. Open a Pull Request against the `main` branch.
4. Fill out the Pull Request template completely.
5. Wait for automated CI checks to pass.
6. Obtain approval from at least one core maintainer before merging.

## Development Setup

See the [README.md](./README.md) for instructions on setting up the client and server environments locally.
