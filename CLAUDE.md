# course-registration-website

## Project Documents

| Document | Question | Contains |
|----------|----------|----------|
| `docs/prd.md` | **Why** does this exist? | Problem statement, users, success criteria, journeys |
| `docs/spec.md` | **What** does this do? | Requirements, behaviors, acceptance criteria |
| `docs/systemdesign.md` | **How** does this work? | Architecture, packages, interfaces, build order |
| `docs/roadmap.md` | **When/Who** does what get built? | Phases, milestones, gates, agent allocation |

## Roles

- `super/` - super agent directory
- `pm/` - pm agent directory
- `eng1/` - eng1 agent directory
- `eng2/` - eng2 agent directory
- `qa1/` - qa1 agent directory
- `qa2/` - qa2 agent directory

## Issue Tracking

Uses beads (`bd` CLI). All work is tracked as beads.

```bash
bd ready            # See unblocked work
bd list             # See all beads
bd show <id>        # Bead details
bd update <id> --status <status>  # Transition bead
```

## Communication

```bash
initech send <agent> "message"   # Send message to an agent
initech peek <agent>              # Read agent terminal output
```
