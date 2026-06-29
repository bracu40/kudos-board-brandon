# Kudos Board — Project Planning Document

## Project Overview
Full-stack app where users create themed boards with kudos cards. Features: search/filter boards, create cards with GIPHY, upvote cards.

---

## Section 1: Component Architecture

### Component Hierarchy
```
App (routing)
├── HomePage (boards, searchQuery, selectedCategory, filteredBoards)
│   ├── Header
│   ├── Banner
│   ├── SearchBar (searchQuery, onSearch, onClear)
│   ├── FilterButtons (selectedCategory, onFilterChange)
│   ├── CreateBoardForm (title, category, author, imageUrl, isSubmitting, error)
│   ├── BoardGrid (boards[], onBoardDeleted)
│   │   └── BoardTile (board, onDelete, isDeleting) → click navigates to /boards/:id
│   └── Footer
└── BoardPage (boardId, cards[], isLoading)
    ├── Header
    ├── CreateCardForm (boardId, message, author, gifUrl, giphySearchQuery, giphyResults, selectedGif, isSearching, isSubmitting)
    ├── CardGrid (cards[], onCardDeleted, onCardUpvoted)
    │   └── CardTile (card, onDelete, onUpvote, isUpvoting, isDeleting)
    └── Footer
```

**Key Interactions:**
- HomePage: fetches boards on mount, search filters by title, category filter (All/Recent/Celebration/Thank You/Inspiration)
- CreateBoardForm: POST /boards with validation (title & category required)
- BoardTile: click navigates, delete button calls DELETE /boards/:id
- CreateCardForm: GIPHY search → select gif → POST /cards
- CardTile: upvote button PATCH /cards/:id/upvote, delete button DELETE /cards/:id

---

## Section 2: API Contracts

Base URL: `http://localhost:5000`

### Boards
**GET /boards**  
→ 200: `{boards: [{id, title, category, author?, imageUrl, createdAt}]}`

**POST /boards**  
← `{title*, category*, author?, imageUrl*}`  
→ 201: `{board: {id, title, category, author, imageUrl, createdAt}}`  
→ 400: Missing title or category

**DELETE /boards/:id**  
→ 204: No content  
→ 404: Board not found

### Cards
**GET /boards/:boardId/cards**  
→ 200: `{cards: [{id, boardId, message, gifUrl, author?, upvotes, createdAt}]}`  
→ 404: Board not found

**POST /cards**  
← `{boardId*, message*, gifUrl*, author?}`  
→ 201: `{card: {id, boardId, message, gifUrl, author, upvotes: 0, createdAt}}`  
→ 400: Missing required fields  
→ 404: Board not found

**PATCH /cards/:id/upvote**  
→ 200: `{card: {..., upvotes: incremented}}`  
→ 404: Card not found

**DELETE /cards/:id**  
→ 204: No content  
→ 404: Card not found

*Fields marked with * are required

---

## Section 3: Database Schema Spec

```prisma
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  category  String   // "celebration" | "thank-you" | "inspiration"
  author    String?
  imageUrl  String
  createdAt DateTime @default(now())
  cards     Card[]
}

model Card {
  id        Int      @id @default(autoincrement())
  boardId   Int
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  message   String
  gifUrl    String
  author    String?
  upvotes   Int      @default(0)
  createdAt DateTime @default(now())
}
```

**Relationships:** Board → Cards (one-to-many, cascade delete)

---

## Section 4: State Architecture

### HomePage
- `boards: Board[]` — fetched on mount, updated on create/delete
- `searchQuery: string` — controlled by SearchBar
- `selectedCategory: 'all' | 'recent' | 'celebration' | 'thank-you' | 'inspiration'` — controlled by FilterButtons
- `filteredBoards` (computed) — applies search (case-insensitive title match) + category filter (recent = sort by createdAt desc, take 6)

### CreateBoardForm
- `title, category, author, imageUrl: string` — form inputs
- `isSubmitting: boolean, error: string | null` — submission state

### BoardPage
- `boardId: number` — from URL params
- `cards: Card[]` — fetched on mount, updated on create/delete/upvote
- `isLoading: boolean`

### CreateCardForm
- `message, author, gifUrl: string` — form inputs
- `giphySearchQuery: string, giphyResults: GIF[], selectedGif: GIF | null` — GIPHY search state
- `isSearching, isSubmitting: boolean, error: string | null` — loading/error states

### BoardTile & CardTile
- `isDeleting: boolean` — loading state during delete
- CardTile also has `isUpvoting: boolean`

---

## Additional Notes

**Work Split:**
- Prateek: Boards (backend + frontend)
- Brandon: Cards (backend + frontend + GIPHY)
- Charles: Discovery (search/filter) + integration

**External API:** GIPHY (https://api.giphy.com/v1/gifs/search) — get key from https://developers.giphy.com/

**Tech Stack:** React, React Router, Express, Prisma, PostgreSQL

**Filter Logic:**
- Search: case-insensitive `title.includes(query)`
- Recent: sort by `createdAt` desc, take first 6
- Category: filter by `category === selected`

---

**Code-Spec Parity:** To be verified during Milestones 1-3
