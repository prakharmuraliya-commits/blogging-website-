/* ==========================================================================
   DevInsights Blogging Platform - Application Logic (ES6 Vanilla JavaScript)
   Handles state management, local storage persistence, DOM rendering, 
   search/filtering, theme toggling, interactive reader, and post creation.
   ========================================================================== */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 0. Fallback SVG Generator for 100% Reliable Image Rendering
    // --------------------------------------------------------------------------
    function getSvgFallbackImage(category, title = 'Article') {
        const categoryColors = {
            'Software Dev': ['#1e40af', '#3b82f6', '#60a5fa'],
            'AI & Data': ['#5b21b6', '#8b5cf6', '#a78bfa'],
            'Student Guide': ['#065f46', '#10b981', '#34d399'],
            'Web Design': ['#9a3412', '#f97316', '#fb923c'],
            'Technology': ['#075985', '#0284c7', '#38bdf8']
        };
        const colors = categoryColors[category] || ['#1e293b', '#2563eb', '#60a5fa'];
        const safeTitle = escapeHtml(title || 'DevArticle').slice(0, 32);
        const safeCat = escapeHtml(category || 'TECH').toUpperCase();

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
            <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${colors[0]}" />
                    <stop offset="100%" stop-color="${colors[1]}" />
                </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgGrad)" />
            <circle cx="680" cy="100" r="160" fill="#ffffff" fill-opacity="0.08" />
            <circle cx="120" cy="380" r="200" fill="#ffffff" fill-opacity="0.05" />
            <rect x="50" y="50" width="130" height="32" rx="16" fill="#ffffff" fill-opacity="0.2" />
            <text x="115" y="71" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">${safeCat}</text>
            <text x="50" y="380" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="28" font-weight="bold">${safeTitle}</text>
        </svg>`;

        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // --------------------------------------------------------------------------
    // 1. Initial Seed Articles Dataset (For College Demo)
    // --------------------------------------------------------------------------
    const INITIAL_SEED_POSTS = [
        {
            id: 'post-1',
            title: 'Building Modern Web Applications with HTML5, CSS3, and Pure JavaScript',
            category: 'Software Dev',
            excerpt: 'Learn how to build responsive, fast, and scalable web apps without bloated dependencies using clean modern JavaScript standards.',
            content: `## Introduction to Modern Web Standards\n\nWeb development has matured significantly over the past decade. While full-stack JavaScript frameworks dominate the modern enterprise landscape, mastering core foundational web technologies—HTML5, CSS3, and Vanilla JavaScript—remains the most essential skill for any software engineer.\n\n> "Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra\n\n## Why Modern Vanilla JS is Powerful\n\nWith contemporary ECMAScript (ES6+) specifications, native JavaScript now provides rich, built-in features that once required heavy external libraries:\n\n- **Native Modules (ESM)** for clean code structure\n- **Fetch API & Async/Await** for seamless asynchronous data calls\n- **Web Storage API (LocalStorage & IndexedDB)** for client-side persistence\n- **CSS Custom Properties (Variables)** for effortless theme switching\n\n\`\`\`javascript\n// Clean ES6+ Async Data Fetching Example\nasync function fetchArticles(category) {\n    try {\n        const response = await fetch(\`/api/articles?category=\${category}\`);\n        const data = await response.json();\n        return data;\n    } catch (error) {\n        console.error('Failed to load articles:', error);\n    }\n}\n\`\`\`\n\n## Architectural Best Practices\n\nWhen organizing pure JavaScript projects, keep your components modular. Separate layout structure (HTML), design tokens (CSS variables), and state manipulation (JS event handlers).\n\nThis project is a prime example of building a complete, feature-rich blog engine using native web standards!`,
            author: 'Alexander Wright',
            authorRole: 'Senior Full Stack Lead',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            date: 'Sep 24, 2026',
            readTime: '5 min read',
            likes: 42,
            views: 310,
            tags: ['JavaScript', 'HTML5', 'CSS3', 'Web Dev'],
            coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
            isFeatured: true,
            isUserCreated: false,
            comments: [
                {
                    id: 'c-1',
                    author: 'Priya Sharma',
                    avatar: '👩‍💻',
                    text: 'Extremely insightful article! Building without heavy frameworks is such an important foundational skill.',
                    date: 'Sep 25, 2026',
                    likes: 6
                },
                {
                    id: 'c-2',
                    author: 'Rahul Verma',
                    avatar: '🎓',
                    text: 'Great breakdown of modern JS capabilities. Using LocalStorage for persistence in this college project is super clean!',
                    date: 'Sep 25, 2026',
                    likes: 4
                }
            ]
        },
        {
            id: 'post-2',
            title: 'Understanding Artificial Intelligence & Machine Learning Trends in 2026',
            category: 'AI & Data',
            excerpt: 'A comprehensive guide into generative AI models, agentic workflows, and how engineering teams are integrating AI into daily workflows.',
            content: `## The Next Era of Artificial Intelligence\n\nArtificial Intelligence is rapidly transitioning from passive chat assistants to **autonomous agentic workflows** capable of multi-step problem solving, code analysis, and complex data synthesis.\n\n## Core Pillars of Modern AI Systems\n\n1. **Multimodal Reasoning**: Models processing text, vision, audio, and code simultaneously.\n2. **Tool Retrieval & Execution**: Agents using APIs, web search, and terminal environments.\n3. **Local & On-Device AI**: Running lightweight models directly in web browsers via WebGPU.\n\n\`\`\`python\n# Example Conceptual Pipeline\ndef execute_agent_task(prompt):\n    context = retrieve_knowledge(prompt)\n    plan = generate_execution_plan(prompt, context)\n    return run_tool_pipeline(plan)\n\`\`\`\n\n> "AI will not replace developers, but developers who harness AI will replace those who do not."\n\nAs computer science students, understanding these fundamentals is crucial for future-proofing your career.`,
            author: 'Dr. Ellen Vance',
            authorRole: 'AI Research Scientist',
            authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
            date: 'Sep 22, 2026',
            readTime: '6 min read',
            likes: 89,
            views: 540,
            tags: ['AI', 'Machine Learning', 'Future Tech'],
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            isFeatured: false,
            isUserCreated: false,
            comments: [
                {
                    id: 'c-3',
                    author: 'David Chen',
                    avatar: '👨‍💻',
                    text: 'Fascinating perspective on Agentic AI workflows!',
                    date: 'Sep 23, 2026',
                    likes: 3
                }
            ]
        },
        {
            id: 'post-3',
            title: 'A College Student’s Guide to Cracking Coding Interviews & Portfolio Building',
            category: 'Student Guide',
            excerpt: 'Practical actionable strategies for university students to showcase real projects, prepare Data Structures & Algorithms, and land tech jobs.',
            content: `## Essential Roadmap for Tech Students\n\nNavigating university exams while building job-ready software skills can feel overwhelming. Here is a proven step-by-step roadmap to build a standout engineering profile:\n\n## 1. Quality Over Quantity in Projects\n\nInstead of 10 generic tutorial clones, focus on **2 solid, fully-functional web applications** with:\n- Clean UI/UX design\n- Persisted data / Real working backend or LocalStorage\n- Detailed README documentation & Live Hosted URL\n\n## 2. Core CS Fundamentals\n\n- Data Structures: Arrays, Linked Lists, Trees, Graphs, Hash Maps\n- System Design Basics: REST APIs, Caching, Databases\n- Version Control: Clean Git commit histories\n\n> Tip: Projects like this Blogging Web Application showcase your ability to design complete end-to-end user interfaces!`,
            author: 'Michael Chang',
            authorRole: 'Career Mentor & Alumnus',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            date: 'Sep 19, 2026',
            readTime: '4 min read',
            likes: 67,
            views: 420,
            tags: ['Career', 'College', 'Interview Prep'],
            coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            isFeatured: false,
            isUserCreated: false,
            comments: []
        },
        {
            id: 'post-4',
            title: 'Mastering CSS Grid & Flexbox: Crafting Responsive Clean Layouts',
            category: 'Web Design',
            excerpt: 'Stop guessing CSS layout rules. Learn when to use CSS Grid versus Flexbox to create pixel-perfect professional web interfaces.',
            content: `## Flexbox vs CSS Grid: The Rule of Thumb\n\n- **CSS Flexbox**: Best for 1-Dimensional layouts (Rows or Columns), such as navigation bars, button groups, and badge lists.\n- **CSS Grid**: Best for 2-Dimensional layouts (Rows AND Columns simultaneously), such as main article feeds, dashboard grids, and image galleries.\n\n\`\`\`css\n/* CSS Grid Example for Article Cards */\n.posts-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    gap: 1.5rem;\n}\n\`\`\`\n\nMastering both will dramatically elevate your web design quality!`,
            author: 'Sarah Jenkins',
            authorRole: 'UI/UX Design Lead',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            date: 'Sep 15, 2026',
            readTime: '3 min read',
            likes: 51,
            views: 290,
            tags: ['CSS3', 'Web Design', 'Frontend'],
            coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            isFeatured: false,
            isUserCreated: false,
            comments: []
        }
    ];

    // --------------------------------------------------------------------------
    // 2. Application State Management
    // --------------------------------------------------------------------------
    let state = {
        posts: [],
        bookmarks: [],
        userLikes: [],
        users: [],
        currentUser: null,
        activeCategory: 'All',
        searchQuery: '',
        sortBy: 'latest',
        theme: 'light',
        currentReadingPostId: null
    };

    // --------------------------------------------------------------------------
    // 3. Storage Persistence Engine
    // --------------------------------------------------------------------------
    function initStorage() {
        // Theme init
        const savedTheme = localStorage.getItem('dev_insights_theme');
        if (savedTheme) {
            state.theme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            state.theme = 'dark';
        }
        applyTheme(state.theme);

        // Posts init
        const savedPosts = localStorage.getItem('dev_insights_posts');
        if (savedPosts) {
            try {
                state.posts = JSON.parse(savedPosts);
                // Auto-repair any broken coverImage reference
                let modified = false;
                state.posts.forEach(p => {
                    if (!p.coverImage || p.coverImage === 'hero.jpg') {
                        p.coverImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
                        modified = true;
                    }
                });
                if (modified) savePostsToStorage();
            } catch (e) {
                console.error('Error parsing stored posts, loading defaults', e);
                state.posts = INITIAL_SEED_POSTS;
            }
        } else {
            state.posts = INITIAL_SEED_POSTS;
            savePostsToStorage();
        }

        // Bookmarks init
        const savedBookmarks = localStorage.getItem('dev_insights_bookmarks');
        if (savedBookmarks) {
            try { state.bookmarks = JSON.parse(savedBookmarks); } catch (e) { state.bookmarks = []; }
        }

        // Likes init
        const savedLikes = localStorage.getItem('dev_insights_likes');
        if (savedLikes) {
            try { state.userLikes = JSON.parse(savedLikes); } catch (e) { state.userLikes = []; }
        }

        // Auth init
        const savedUser = localStorage.getItem('dev_insights_current_user');
        if (savedUser) {
            try { state.currentUser = JSON.parse(savedUser); } catch (e) { state.currentUser = null; }
        }

        const savedUsers = localStorage.getItem('dev_insights_users');
        if (savedUsers) {
            try { state.users = JSON.parse(savedUsers); } catch (e) { state.users = []; }
        }
    }

    function savePostsToStorage() {
        localStorage.setItem('dev_insights_posts', JSON.stringify(state.posts));
    }

    function saveBookmarksToStorage() {
        localStorage.setItem('dev_insights_bookmarks', JSON.stringify(state.bookmarks));
        updateBookmarkBadge();
    }

    function saveLikesToStorage() {
        localStorage.setItem('dev_insights_likes', JSON.stringify(state.userLikes));
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dev_insights_theme', theme);

        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline-block';
            } else {
                sunIcon.style.display = 'inline-block';
                moonIcon.style.display = 'none';
            }
        }
    }

    // --------------------------------------------------------------------------
    // 4. DOM Elements Cache
    // --------------------------------------------------------------------------
    const DOM = {
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        openBookmarksBtn: document.getElementById('openBookmarksBtn'),
        bookmarkBadge: document.getElementById('bookmarkBadge'),
        openProfileBtn: document.getElementById('openProfileBtn'),
        openWriteModalBtn: document.getElementById('openWriteModalBtn'),
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        categoryPills: document.getElementById('categoryPills'),
        sortSelect: document.getElementById('sortSelect'),
        heroSection: document.getElementById('heroSection'),
        feedTitle: document.getElementById('feedTitle'),
        resultsCount: document.getElementById('resultsCount'),
        postsContainer: document.getElementById('postsContainer'),
        emptyState: document.getElementById('emptyState'),
        resetFiltersBtn: document.getElementById('resetFiltersBtn'),
        tagsCloud: document.getElementById('tagsCloud'),
        authorsList: document.getElementById('authorsList'),
        newsletterForm: document.getElementById('newsletterForm'),
        newsletterEmail: document.getElementById('newsletterEmail'),
        footerResetData: document.getElementById('footerResetData'),
        toastContainer: document.getElementById('toastContainer'),

        // Reader Modal
        readerModal: document.getElementById('readerModal'),
        closeReaderModalBtn: document.getElementById('closeReaderModalBtn'),
        readingProgressBar: document.getElementById('readingProgressBar'),
        readerCategory: document.getElementById('readerCategory'),
        readerDate: document.getElementById('readerDate'),
        readerTime: document.getElementById('readerTime'),
        readerTitle: document.getElementById('readerTitle'),
        readerAuthorAvatar: document.getElementById('readerAuthorAvatar'),
        readerAuthorName: document.getElementById('readerAuthorName'),
        readerAuthorRole: document.getElementById('readerAuthorRole'),
        readerCoverImg: document.getElementById('readerCoverImg'),
        readerProseContent: document.getElementById('readerProseContent'),
        readerTagsBox: document.getElementById('readerTagsBox'),
        readerLikeBtn: document.getElementById('readerLikeBtn'),
        readerLikeCount: document.getElementById('readerLikeCount'),
        readerBookmarkBtn: document.getElementById('readerBookmarkBtn'),
        readerBookmarkText: document.getElementById('readerBookmarkText'),
        readerShareBtn: document.getElementById('readerShareBtn'),
        commentsCount: document.getElementById('commentsCount'),
        commentForm: document.getElementById('commentForm'),
        commentAuthorInput: document.getElementById('commentAuthorInput'),
        commentAvatarInput: document.getElementById('commentAvatarInput'),
        commentTextInput: document.getElementById('commentTextInput'),
        commentsList: document.getElementById('commentsList'),

        // Write Modal
        writeModal: document.getElementById('writeModal'),
        closeWriteModalBtn: document.getElementById('closeWriteModalBtn'),
        createPostForm: document.getElementById('createPostForm'),
        editorTabBtn: document.getElementById('editorTabBtn'),
        previewTabBtn: document.getElementById('previewTabBtn'),
        livePreviewContainer: document.getElementById('livePreviewContainer'),
        postTitleInput: document.getElementById('postTitleInput'),
        postCategoryInput: document.getElementById('postCategoryInput'),
        postReadTimeInput: document.getElementById('postReadTimeInput'),
        postAuthorInput: document.getElementById('postAuthorInput'),
        postTagsInput: document.getElementById('postTagsInput'),
        postCoverPresetSelect: document.getElementById('postCoverPresetSelect'),
        customCoverUrlInput: document.getElementById('customCoverUrlInput'),
        postImageFileInput: document.getElementById('postImageFileInput'),
        uploadInputBox: document.getElementById('uploadInputBox'),
        presetInputBox: document.getElementById('presetInputBox'),
        urlInputBox: document.getElementById('urlInputBox'),
        formImagePreviewContainer: document.getElementById('formImagePreviewContainer'),
        formImagePreviewImg: document.getElementById('formImagePreviewImg'),
        removePreviewBtn: document.getElementById('removePreviewBtn'),
        postExcerptInput: document.getElementById('postExcerptInput'),
        postContentInput: document.getElementById('postContentInput'),
        saveDraftBtn: document.getElementById('saveDraftBtn'),

        // Bookmarks Modal
        bookmarksModal: document.getElementById('bookmarksModal'),
        closeBookmarksModalBtn: document.getElementById('closeBookmarksModalBtn'),
        bookmarksList: document.getElementById('bookmarksList'),

        // Profile Modal
        profileModal: document.getElementById('profileModal'),
        closeProfileModalBtn: document.getElementById('closeProfileModalBtn'),
        profileTotalPosts: document.getElementById('profileTotalPosts'),
        profileTotalLikes: document.getElementById('profileTotalLikes'),
        profileBookmarksCount: document.getElementById('profileBookmarksCount'),
        myPostsList: document.getElementById('myPostsList'),

        // Auth Modal & Buttons
        openAuthModalBtn: document.getElementById('openAuthModalBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        authModal: document.getElementById('authModal'),
        closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
        loginTabBtn: document.getElementById('loginTabBtn'),
        signupTabBtn: document.getElementById('signupTabBtn'),
        loginForm: document.getElementById('loginForm'),
        signupForm: document.getElementById('signupForm'),
        loginEmailInput: document.getElementById('loginEmailInput'),
        loginPasswordInput: document.getElementById('loginPasswordInput'),
        toggleLoginPasswordBtn: document.getElementById('toggleLoginPasswordBtn'),
        demoStudentLoginBtn: document.getElementById('demoStudentLoginBtn'),
        signupNameInput: document.getElementById('signupNameInput'),
        signupUsernameInput: document.getElementById('signupUsernameInput'),
        signupEmailInput: document.getElementById('signupEmailInput'),
        signupPasswordInput: document.getElementById('signupPasswordInput'),
        signupAvatarInput: document.getElementById('signupAvatarInput')
    };

    // --------------------------------------------------------------------------
    // 5. Rendering Engine
    // --------------------------------------------------------------------------
    function renderApp() {
        updateBookmarkBadge();
        updateAuthUI();
        renderHeroBanner();
        renderFeed();
        renderSidebar();
    }

    function updateAuthUI() {
        if (state.currentUser) {
            if (DOM.openAuthModalBtn) DOM.openAuthModalBtn.style.display = 'none';
            if (DOM.logoutBtn) {
                DOM.logoutBtn.style.display = 'inline-flex';
                DOM.logoutBtn.title = `Logged in as ${state.currentUser.name}`;
            }

            // Update Author input fields
            if (DOM.postAuthorInput) DOM.postAuthorInput.value = state.currentUser.name;
            if (DOM.commentAuthorInput) DOM.commentAuthorInput.value = state.currentUser.name;
            if (DOM.commentAvatarInput && state.currentUser.avatar) DOM.commentAvatarInput.value = state.currentUser.avatar;
        } else {
            if (DOM.openAuthModalBtn) DOM.openAuthModalBtn.style.display = 'inline-flex';
            if (DOM.logoutBtn) DOM.logoutBtn.style.display = 'none';
        }
    }

    function updateBookmarkBadge() {
        if (DOM.bookmarkBadge) {
            DOM.bookmarkBadge.textContent = state.bookmarks.length;
        }
    }

    function getFilteredAndSortedPosts() {
        let list = [...state.posts];

        // 1. Category Filter
        if (state.activeCategory !== 'All') {
            list = list.filter(p => p.category === state.activeCategory);
        }

        // 2. Search Query Filter
        if (state.searchQuery.trim() !== '') {
            const query = state.searchQuery.toLowerCase();
            list = list.filter(p => {
                const matchTitle = p.title.toLowerCase().includes(query);
                const matchExcerpt = p.excerpt.toLowerCase().includes(query);
                const matchAuthor = p.author.toLowerCase().includes(query);
                const matchTags = p.tags && p.tags.some(t => t.toLowerCase().includes(query));
                return matchTitle || matchExcerpt || matchAuthor || matchTags;
            });
        }

        // 3. Sorting
        if (state.sortBy === 'popular') {
            list.sort((a, b) => b.likes - a.likes);
        } else if (state.sortBy === 'readingTime') {
            list.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
        } else {
            // Latest (default order or reverse index)
            list.reverse();
        }

        return list;
    }

    function getCategoryBadgeClass(category) {
        if (category === 'Software Dev') return 'badge-software-dev';
        if (category === 'AI & Data') return 'badge-ai-data';
        if (category === 'Student Guide') return 'badge-student-guide';
        if (category === 'Web Design') return 'badge-web-design';
        if (category === 'Technology') return 'badge-technology';
        return 'badge-category';
    }

    function renderHeroBanner() {
        const featuredPost = state.posts.find(p => p.isFeatured) || state.posts[0];
        if (!featuredPost || state.searchQuery.trim() !== '' || state.activeCategory !== 'All') {
            DOM.heroSection.style.display = 'none';
            return;
        }

        DOM.heroSection.style.display = 'block';
        const isBookmarked = state.bookmarks.includes(featuredPost.id);
        const coverSrc = (featuredPost.coverImage && featuredPost.coverImage !== 'hero.jpg') ? featuredPost.coverImage : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
        const badgeClass = getCategoryBadgeClass(featuredPost.category);

        DOM.heroSection.innerHTML = `
            <div class="featured-hero-card">
                <div class="hero-image-box" onclick="window.DevInsights.openReader('${featuredPost.id}')">
                    <span class="badge ${badgeClass}" style="position: absolute; top: 1rem; left: 1rem; z-index: 5; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">🔥 FEATURED STORY</span>
                    <img src="${coverSrc}" alt="${escapeHtml(featuredPost.title)}" onerror="this.onerror=null; this.src=window.DevInsights.getFallback('${escapeHtml(featuredPost.category)}', '${escapeHtml(featuredPost.title)}');">
                </div>
                <div class="hero-content">
                    <div class="hero-meta">
                        <span class="badge ${badgeClass}">${escapeHtml(featuredPost.category)}</span>
                        <span>• ${escapeHtml(featuredPost.date)}</span>
                        <span>• ${escapeHtml(featuredPost.readTime)}</span>
                    </div>
                    <h1 class="hero-title" onclick="window.DevInsights.openReader('${featuredPost.id}')">${escapeHtml(featuredPost.title)}</h1>
                    <p class="hero-excerpt">${escapeHtml(featuredPost.excerpt)}</p>
                    <div class="hero-footer">
                        <div class="author-chip">
                            <img src="${featuredPost.authorAvatar}" alt="${escapeHtml(featuredPost.author)}" class="author-avatar" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';">
                            <div>
                                <div class="author-name">${escapeHtml(featuredPost.author)}</div>
                                <small style="color: var(--text-muted);">${escapeHtml(featuredPost.authorRole || 'Contributor')}</small>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="window.DevInsights.openReader('${featuredPost.id}')">Read Article →</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFeed() {
        const posts = getFilteredAndSortedPosts();

        DOM.resultsCount.textContent = `${posts.length} ${posts.length === 1 ? 'article' : 'articles'} found`;

        if (state.searchQuery.trim() !== '') {
            DOM.feedTitle.textContent = `Search results for "${state.searchQuery}"`;
        } else if (state.activeCategory !== 'All') {
            DOM.feedTitle.textContent = `${state.activeCategory} Articles`;
        } else {
            DOM.feedTitle.textContent = 'All Articles';
        }

        if (posts.length === 0) {
            DOM.postsContainer.style.display = 'none';
            DOM.emptyState.style.display = 'block';
            return;
        }

        DOM.postsContainer.style.display = 'grid';
        DOM.emptyState.style.display = 'none';

        DOM.postsContainer.innerHTML = posts.map(post => {
            const isBookmarked = state.bookmarks.includes(post.id);
            const isLiked = state.userLikes.includes(post.id);
            const coverSrc = (post.coverImage && post.coverImage !== 'hero.jpg') ? post.coverImage : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
            const badgeClass = getCategoryBadgeClass(post.category);

            return `
                <article class="post-card" id="card-${post.id}">
                    <div class="card-image-box" onclick="window.DevInsights.openReader('${post.id}')">
                        <span class="badge ${badgeClass} card-category-tag">${escapeHtml(post.category)}</span>
                        <img src="${coverSrc}" alt="${escapeHtml(post.title)}" loading="lazy" onerror="this.onerror=null; this.src=window.DevInsights.getFallback('${escapeHtml(post.category)}', '${escapeHtml(post.title)}');">
                    </div>
                    <div class="card-body">
                        <div class="card-meta-top">
                            <span>${escapeHtml(post.date)}</span>
                            <span>•</span>
                            <span>${escapeHtml(post.readTime)}</span>
                        </div>
                        <h3 class="card-title" onclick="window.DevInsights.openReader('${post.id}')">${escapeHtml(post.title)}</h3>
                        <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
                        <div class="card-footer">
                            <div class="author-chip">
                                <img src="${post.authorAvatar}" alt="${escapeHtml(post.author)}" class="author-avatar" style="width: 28px; height: 28px;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';">
                                <span class="author-name" style="font-size: 0.8125rem;">${escapeHtml(post.author)}</span>
                            </div>
                            <div class="card-actions">
                                <button class="action-icon-btn ${isLiked ? 'liked' : ''}" onclick="window.DevInsights.toggleLike('${post.id}', event)" title="Like article">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    <span>${post.likes}</span>
                                </button>

                                <button class="action-icon-btn ${isBookmarked ? 'active' : ''}" onclick="window.DevInsights.toggleBookmark('${post.id}', event)" title="Save to bookmarks">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderSidebar() {
        // Collect all unique tags across posts
        const allTags = new Set();
        state.posts.forEach(p => {
            if (p.tags) p.tags.forEach(t => allTags.add(t));
        });

        DOM.tagsCloud.innerHTML = Array.from(allTags).map(tag => `
            <button class="tag-btn" onclick="window.DevInsights.filterByTag('${escapeHtml(tag)}')">#${escapeHtml(tag)}</button>
        `).join('');

        // Distinct authors
        const authorsMap = new Map();
        state.posts.forEach(p => {
            if (!authorsMap.has(p.author)) {
                authorsMap.set(p.author, {
                    name: p.author,
                    role: p.authorRole || 'Author',
                    avatar: p.authorAvatar
                });
            }
        });

        DOM.authorsList.innerHTML = Array.from(authorsMap.values()).slice(0, 4).map(auth => `
            <div class="author-item">
                <img src="${auth.avatar}" alt="${escapeHtml(auth.name)}">
                <div class="author-item-info">
                    <h4>${escapeHtml(auth.name)}</h4>
                    <p>${escapeHtml(auth.role)}</p>
                </div>
            </div>
        `).join('');
    }

    // --------------------------------------------------------------------------
    // 6. Article Reader Modal Logic
    // --------------------------------------------------------------------------
    function openReaderModal(postId) {
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;

        state.currentReadingPostId = postId;
        post.views = (post.views || 0) + 1;
        savePostsToStorage();

        // Populate Modal Fields
        DOM.readerCategory.textContent = post.category;
        DOM.readerCategory.className = `badge ${getCategoryBadgeClass(post.category)}`;
        DOM.readerDate.textContent = post.date;
        DOM.readerTime.textContent = post.readTime;
        DOM.readerTitle.textContent = post.title;
        DOM.readerAuthorAvatar.src = post.authorAvatar;
        DOM.readerAuthorAvatar.onerror = function () {
            this.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
        };

        const coverSrc = (post.coverImage && post.coverImage !== 'hero.jpg') ? post.coverImage : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
        DOM.readerCoverImg.src = coverSrc;
        DOM.readerCoverImg.onerror = function () {
            this.src = getSvgFallbackImage(post.category, post.title);
        };

        // Render Markdown-styled prose content safely
        DOM.readerProseContent.innerHTML = formatProseContent(post.content);

        // Render Tags
        DOM.readerTagsBox.innerHTML = post.tags ? post.tags.map(t => `<span class="badge" style="background-color: var(--bg-muted); color: var(--text-secondary); margin-right: 0.5rem; text-transform: none;">#${escapeHtml(t)}</span>`).join('') : '';

        // Action Toolbar States
        updateReaderActionButtons(post);

        // Render Comments
        renderCommentsList(post);

        // Open Modal
        DOM.readerModal.classList.add('show');
        DOM.readerModal.setAttribute('aria-hidden', 'false');

        // Scroll listener for reading progress bar
        const modalBody = DOM.readerModal.querySelector('.modal-body');
        DOM.readingProgressBar.style.width = '0%';
        modalBody.onscroll = function () {
            const scrollTop = modalBody.scrollTop;
            const scrollHeight = modalBody.scrollHeight - modalBody.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            DOM.readingProgressBar.style.width = `${Math.min(progress, 100)}%`;
        };
    }

    function closeReaderModal() {
        DOM.readerModal.classList.remove('show');
        DOM.readerModal.setAttribute('aria-hidden', 'true');
        state.currentReadingPostId = null;
    }

    function updateReaderActionButtons(post) {
        const isLiked = state.userLikes.includes(post.id);
        const isBookmarked = state.bookmarks.includes(post.id);

        DOM.readerLikeCount.textContent = post.likes;
        if (isLiked) {
            DOM.readerLikeBtn.classList.add('liked');
        } else {
            DOM.readerLikeBtn.classList.remove('liked');
        }

        if (isBookmarked) {
            DOM.readerBookmarkBtn.classList.add('active');
            DOM.readerBookmarkText.textContent = 'Bookmarked';
        } else {
            DOM.readerBookmarkBtn.classList.remove('active');
            DOM.readerBookmarkText.textContent = 'Bookmark';
        }
    }

    function formatProseContent(content) {
        if (!content) return '';
        let html = escapeHtml(content);

        // Blockquotes
        html = html.replace(/^&gt;\s?(.*)$/gim, '<blockquote>$1</blockquote>');

        // Headers
        html = html.replace(/^##\s?(.*)$/gim, '<h2>$1</h2>');
        html = html.replace(/^###\s?(.*)$/gim, '<h3>$1</h3>');

        // Code Blocks
        html = html.replace(/```(?:javascript|python|css|html)?\n([\s\S]*?)\n```/gim, '<pre><code>$1</code></pre>');

        // Paragraphs
        const paragraphs = html.split(/\n\n+/);
        return paragraphs.map(p => {
            if (p.startsWith('<h2>') || p.startsWith('<h3>') || p.startsWith('<blockquote>') || p.startsWith('<pre>')) {
                return p;
            }
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        }).join('');
    }

    function renderCommentsList(post) {
        const comments = post.comments || [];
        DOM.commentsCount.textContent = comments.length;

        if (comments.length === 0) {
            DOM.commentsList.innerHTML = `<p style="font-size: 0.875rem; color: var(--text-muted); font-style: italic;">No comments yet. Be the first to share your thoughts!</p>`;
            return;
        }

        DOM.commentsList.innerHTML = comments.map(c => `
            <div class="comment-card">
                <div class="comment-avatar">${c.avatar || '👩‍💻'}</div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-user">${escapeHtml(c.author)}</span>
                        <span class="comment-time">${escapeHtml(c.date)}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(c.text)}</p>
                </div>
            </div>
        `).join('');
    }

    function handleAddComment(e) {
        e.preventDefault();
        if (!state.currentReadingPostId) return;

        const post = state.posts.find(p => p.id === state.currentReadingPostId);
        if (!post) return;

        const author = DOM.commentAuthorInput.value.trim();
        const avatar = DOM.commentAvatarInput.value;
        const text = DOM.commentTextInput.value.trim();

        if (!author || !text) return;

        if (!post.comments) post.comments = [];
        post.comments.push({
            id: 'c-' + Date.now(),
            author: author,
            avatar: avatar,
            text: text,
            date: 'Just now',
            likes: 0
        });

        savePostsToStorage();
        renderCommentsList(post);
        DOM.commentTextInput.value = '';
        showToast('Comment posted successfully!', 'success');
    }

    // --------------------------------------------------------------------------
    // 7. Write New Post Modal Logic
    // --------------------------------------------------------------------------
    function openWriteModal() {
        DOM.writeModal.classList.add('show');
        DOM.writeModal.setAttribute('aria-hidden', 'false');
    }

    function closeWriteModal() {
        DOM.writeModal.classList.remove('show');
        DOM.writeModal.setAttribute('aria-hidden', 'true');
    }

    function handleCreatePost(e) {
        e.preventDefault();

        const title = DOM.postTitleInput.value.trim();
        const category = DOM.postCategoryInput.value;
        const readTime = DOM.postReadTimeInput.value.trim();
        const author = DOM.postAuthorInput.value.trim();
        const tagsRaw = DOM.postTagsInput.value.trim();
        const excerpt = DOM.postExcerptInput.value.trim();
        const content = DOM.postContentInput.value.trim();

        let coverImage = 'hero.jpg';

        if (state.uploadedImageDataUrl) {
            // User uploaded a local file
            coverImage = state.uploadedImageDataUrl;
        } else {
            const selectedSourceType = document.querySelector('input[name="imageSourceType"]:checked')?.value || 'preset';
            if (selectedSourceType === 'preset') {
                coverImage = DOM.postCoverPresetSelect.value || 'hero.jpg';
            } else if (selectedSourceType === 'url') {
                coverImage = DOM.customCoverUrlInput.value.trim() || 'hero.jpg';
            } else {
                coverImage = DOM.postCoverPresetSelect.value || 'hero.jpg';
            }
        }

        const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [category];

        const newPost = {
            id: 'post-' + Date.now(),
            title: title,
            category: category,
            excerpt: excerpt,
            content: content,
            author: author,
            authorRole: 'Student Contributor',
            authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            date: 'Just now',
            readTime: readTime || '4 min read',
            likes: 0,
            views: 0,
            tags: tags,
            coverImage: coverImage,
            isFeatured: false,
            isUserCreated: true,
            comments: []
        };

        state.posts.unshift(newPost);
        savePostsToStorage();
        renderApp();

        // Reset Form & Image Preview State
        DOM.createPostForm.reset();
        state.uploadedImageDataUrl = null;
        if (DOM.formImagePreviewContainer) DOM.formImagePreviewContainer.style.display = 'none';
        
        // Reset dropzone text
        const dropzoneText = document.getElementById('dropzoneStatusText');
        if (dropzoneText) dropzoneText.textContent = 'Click or Drag & Drop image file here';

        closeWriteModal();
        showToast('Article published successfully with your image!', 'success');
    }

    // --------------------------------------------------------------------------
    // 8. Bookmarks & Profile Modals
    // --------------------------------------------------------------------------
    function openBookmarksModal() {
        const bookmarkedPosts = state.posts.filter(p => state.bookmarks.includes(p.id));

        if (bookmarkedPosts.length === 0) {
            DOM.bookmarksList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No saved articles yet. Click the bookmark icon on any card to save it here.</p>`;
        } else {
            DOM.bookmarksList.innerHTML = bookmarkedPosts.map(p => `
                <div class="item-row">
                    <div>
                        <span class="badge badge-category" style="font-size: 0.6875rem;">${escapeHtml(p.category)}</span>
                        <div class="item-title" style="margin-top: 0.25rem;">${escapeHtml(p.title)}</div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: 0.75rem;" onclick="window.DevInsights.openReader('${p.id}'); DevInsights.closeBookmarksModal();">Read</button>
                        <button class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: 0.75rem; color: #ef4444;" onclick="window.DevInsights.toggleBookmark('${p.id}', event); DevInsights.openBookmarksModal();">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        DOM.bookmarksModal.classList.add('show');
    }

    function closeBookmarksModal() {
        DOM.bookmarksModal.classList.remove('show');
    }

    function openProfileModal() {
        const userPosts = state.posts.filter(p => p.isUserCreated);
        const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes || 0), 0);

        DOM.profileTotalPosts.textContent = userPosts.length;
        DOM.profileTotalLikes.textContent = totalLikes;
        DOM.profileBookmarksCount.textContent = state.bookmarks.length;

        if (userPosts.length === 0) {
            DOM.myPostsList.innerHTML = `<p style="font-size: 0.875rem; color: var(--text-muted); text-align: center; padding: 1.5rem;">You haven't written any articles yet. Click "+ Write Article" in the top bar to create your first post!</p>`;
        } else {
            DOM.myPostsList.innerHTML = userPosts.map(p => `
                <div class="item-row">
                    <div>
                        <div class="item-title">${escapeHtml(p.title)}</div>
                        <small style="color: var(--text-muted);">${p.date} • ${p.likes} Likes</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: 0.75rem;" onclick="window.DevInsights.openReader('${p.id}'); DevInsights.closeProfileModal();">View</button>
                        <button class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: 0.75rem; color: #ef4444;" onclick="window.DevInsights.deleteUserPost('${p.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        DOM.profileModal.classList.add('show');
    }

    function closeProfileModal() {
        DOM.profileModal.classList.remove('show');
    }

    function deleteUserPost(postId) {
        if (confirm('Are you sure you want to delete this article?')) {
            state.posts = state.posts.filter(p => p.id !== postId);
            savePostsToStorage();
            renderApp();
            openProfileModal();
            showToast('Article deleted', 'info');
        }
    }

    // --------------------------------------------------------------------------
    // 9. Interactive Action Handlers
    // --------------------------------------------------------------------------
    function toggleLike(postId, e) {
        if (e) e.stopPropagation();
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;

        const index = state.userLikes.indexOf(postId);
        if (index > -1) {
            state.userLikes.splice(index, 1);
            post.likes = Math.max(0, post.likes - 1);
            showToast('Unliked article', 'info');
        } else {
            state.userLikes.push(postId);
            post.likes += 1;
            showToast('Article liked!', 'success');
        }

        saveLikesToStorage();
        savePostsToStorage();
        renderFeed();
        renderHeroBanner();

        if (state.currentReadingPostId === postId) {
            updateReaderActionButtons(post);
        }
    }

    function toggleBookmark(postId, e) {
        if (e) e.stopPropagation();
        const index = state.bookmarks.indexOf(postId);

        if (index > -1) {
            state.bookmarks.splice(index, 1);
            showToast('Removed from bookmarks', 'info');
        } else {
            state.bookmarks.push(postId);
            showToast('Saved to bookmarks!', 'success');
        }

        saveBookmarksToStorage();
        renderFeed();
        renderHeroBanner();

        if (state.currentReadingPostId === postId) {
            const post = state.posts.find(p => p.id === postId);
            if (post) updateReaderActionButtons(post);
        }
    }

    function filterByTag(tag) {
        state.searchQuery = tag;
        DOM.searchInput.value = tag;
        DOM.clearSearchBtn.style.display = 'block';
        renderFeed();
        renderHeroBanner();
    }

    function showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = msg;
        DOM.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --------------------------------------------------------------------------
    // 9. Authentication Modal & State Logic
    // --------------------------------------------------------------------------
    function openAuthModal() {
        if (DOM.authModal) {
            DOM.authModal.classList.add('show');
            DOM.authModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeAuthModal() {
        if (DOM.authModal) {
            DOM.authModal.classList.remove('show');
            DOM.authModal.setAttribute('aria-hidden', 'true');
        }
    }

    function handleLogin(e) {
        if (e) e.preventDefault();
        const usernameOrEmail = DOM.loginEmailInput.value.trim();
        const password = DOM.loginPasswordInput.value.trim();

        if (!usernameOrEmail) {
            showToast('Please enter your email or username', 'info');
            return;
        }

        // Check if user exists in state.users or create quick session
        let user = state.users.find(u => u.email.toLowerCase() === usernameOrEmail.toLowerCase() || u.username.toLowerCase() === usernameOrEmail.toLowerCase());

        if (!user) {
            user = {
                id: 'u-' + Date.now(),
                name: usernameOrEmail.split('@')[0] || 'Student Member',
                username: usernameOrEmail.split('@')[0],
                email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@college.edu`,
                avatar: '👨‍💻'
            };
            state.users.push(user);
            localStorage.setItem('dev_insights_users', JSON.stringify(state.users));
        }

        state.currentUser = user;
        localStorage.setItem('dev_insights_current_user', JSON.stringify(user));
        updateAuthUI();
        closeAuthModal();
        showToast(`Welcome back, ${user.name}! 👋`, 'success');
    }

    function handleSignup(e) {
        if (e) e.preventDefault();
        const name = DOM.signupNameInput.value.trim();
        const username = DOM.signupUsernameInput.value.trim();
        const email = DOM.signupEmailInput.value.trim();
        const password = DOM.signupPasswordInput.value.trim();
        const avatar = DOM.signupAvatarInput.value;

        if (!name || !username || !email || !password) {
            showToast('Please fill in all required fields', 'info');
            return;
        }

        const newUser = {
            id: 'u-' + Date.now(),
            name: name,
            username: username,
            email: email,
            avatar: avatar
        };

        state.users.push(newUser);
        localStorage.setItem('dev_insights_users', JSON.stringify(state.users));

        state.currentUser = newUser;
        localStorage.setItem('dev_insights_current_user', JSON.stringify(newUser));

        updateAuthUI();
        DOM.signupForm.reset();
        closeAuthModal();
        showToast(`Account created! Logged in as ${name}`, 'success');
    }

    function handleLogout() {
        state.currentUser = null;
        localStorage.removeItem('dev_insights_current_user');
        updateAuthUI();
        showToast('Logged out successfully', 'info');
    }

    function handleDemoLogin() {
        const demoUser = {
            id: 'u-demo-student',
            name: 'Rahul Sharma (Student)',
            username: 'rahul_dev',
            email: 'rahul.sharma@college.edu',
            avatar: '🎓'
        };

        state.currentUser = demoUser;
        localStorage.setItem('dev_insights_current_user', JSON.stringify(demoUser));
        updateAuthUI();
        closeAuthModal();
        showToast('Logged in as Demo Student Rahul Sharma! ⚡', 'success');
    }

    // --------------------------------------------------------------------------
    // 10. Event Listeners Initialization
    // --------------------------------------------------------------------------
    function attachEventListeners() {
        // Auth Triggers & Handlers
        if (DOM.openAuthModalBtn) DOM.openAuthModalBtn.addEventListener('click', openAuthModal);
        if (DOM.closeAuthModalBtn) DOM.closeAuthModalBtn.addEventListener('click', closeAuthModal);
        if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', handleLogout);
        if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLogin);
        if (DOM.signupForm) DOM.signupForm.addEventListener('submit', handleSignup);
        if (DOM.demoStudentLoginBtn) DOM.demoStudentLoginBtn.addEventListener('click', handleDemoLogin);

        // Auth Tabs Toggle (Login vs Sign Up)
        if (DOM.loginTabBtn && DOM.signupTabBtn) {
            DOM.loginTabBtn.addEventListener('click', () => {
                DOM.loginTabBtn.classList.add('active');
                DOM.signupTabBtn.classList.remove('active');
                DOM.loginForm.style.display = 'flex';
                DOM.signupForm.style.display = 'none';
            });
            DOM.signupTabBtn.addEventListener('click', () => {
                DOM.signupTabBtn.classList.add('active');
                DOM.loginTabBtn.classList.remove('active');
                DOM.signupForm.style.display = 'flex';
                DOM.loginForm.style.display = 'none';
            });
        }

        // Toggle Password Visibility
        if (DOM.toggleLoginPasswordBtn && DOM.loginPasswordInput) {
            DOM.toggleLoginPasswordBtn.addEventListener('click', () => {
                const type = DOM.loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                DOM.loginPasswordInput.setAttribute('type', type);
                DOM.toggleLoginPasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
            });
        }

        // Modal Triggers
        DOM.openWriteModalBtn.addEventListener('click', openWriteModal);
        DOM.closeWriteModalBtn.addEventListener('click', closeWriteModal);

        DOM.closeReaderModalBtn.addEventListener('click', closeReaderModal);

        DOM.openBookmarksBtn.addEventListener('click', openBookmarksModal);
        DOM.closeBookmarksModalBtn.addEventListener('click', closeBookmarksModal);

        DOM.openProfileBtn.addEventListener('click', openProfileModal);
        DOM.closeProfileModalBtn.addEventListener('click', closeProfileModal);

        // Image Source Pills Toggle (Upload vs Preset vs URL)
        const radioPills = document.querySelectorAll('input[name="imageSourceType"]');
        radioPills.forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.querySelectorAll('.radio-pill').forEach(pill => pill.classList.remove('active'));
                e.target.closest('.radio-pill').classList.add('active');

                const val = e.target.value;
                DOM.uploadInputBox.style.display = val === 'upload' ? 'block' : 'none';
                DOM.presetInputBox.style.display = val === 'preset' ? 'block' : 'none';
                DOM.urlInputBox.style.display = val === 'url' ? 'block' : 'none';
            });
        });

        // File Reader Upload Handler
        DOM.postImageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'info');
                return;
            }

            // Auto-select the 'upload' radio pill
            const uploadRadio = document.querySelector('input[name="imageSourceType"][value="upload"]');
            if (uploadRadio) {
                uploadRadio.checked = true;
                document.querySelectorAll('.radio-pill').forEach(pill => pill.classList.remove('active'));
                uploadRadio.closest('.radio-pill').classList.add('active');
                DOM.uploadInputBox.style.display = 'block';
                DOM.presetInputBox.style.display = 'none';
                DOM.urlInputBox.style.display = 'none';
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                state.uploadedImageDataUrl = event.target.result;
                DOM.formImagePreviewImg.src = state.uploadedImageDataUrl;
                DOM.formImagePreviewContainer.style.display = 'flex';
                
                const dropzoneStatusText = document.getElementById('dropzoneStatusText');
                if (dropzoneStatusText) {
                    dropzoneStatusText.innerHTML = `✅ Uploaded: <strong>${escapeHtml(file.name)}</strong>`;
                }

                showToast('Image uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        });

        // Drag and drop support on file dropzone
        const dropzone = document.querySelector('.file-dropzone');
        if (dropzone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropzone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('dragover');
                }, false);
            });

            dropzone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files && files.length > 0) {
                    DOM.postImageFileInput.files = files;
                    const event = new Event('change');
                    DOM.postImageFileInput.dispatchEvent(event);
                }
            });
        }

        // Remove Preview Button
        DOM.removePreviewBtn.addEventListener('click', () => {
            state.uploadedImageDataUrl = null;
            DOM.postImageFileInput.value = '';
            DOM.formImagePreviewContainer.style.display = 'none';
            const dropzoneStatusText = document.getElementById('dropzoneStatusText');
            if (dropzoneStatusText) dropzoneStatusText.textContent = 'Click or Drag & Drop image file here';
            showToast('Image removed', 'info');
        });

        // Custom Cover URL Input Live Preview
        DOM.customCoverUrlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                DOM.formImagePreviewImg.src = url;
                DOM.formImagePreviewContainer.style.display = 'flex';
            } else {
                DOM.formImagePreviewContainer.style.display = 'none';
            }
        });

        // Create Post Form Submit
        DOM.createPostForm.addEventListener('submit', handleCreatePost);

        // Editor / Preview Tabs
        DOM.editorTabBtn.addEventListener('click', () => {
            DOM.editorTabBtn.classList.add('active');
            DOM.previewTabBtn.classList.remove('active');
            DOM.createPostForm.style.display = 'flex';
            DOM.livePreviewContainer.style.display = 'none';
        });

        DOM.previewTabBtn.addEventListener('click', () => {
            DOM.editorTabBtn.classList.remove('active');
            DOM.previewTabBtn.classList.add('active');
            DOM.createPostForm.style.display = 'none';
            DOM.livePreviewContainer.style.display = 'block';

            const title = DOM.postTitleInput.value || 'Untitled Article';
            const category = DOM.postCategoryInput.value;
            const content = DOM.postContentInput.value || 'Write article body content to see preview...';

            DOM.livePreviewContainer.innerHTML = `
                <span class="badge badge-category">${escapeHtml(category)}</span>
                <h2 style="font-size: 1.5rem; margin: 0.75rem 0;">${escapeHtml(title)}</h2>
                <div class="reader-content-prose">${formatProseContent(content)}</div>
            `;
        });

        // Save Draft
        DOM.saveDraftBtn.addEventListener('click', () => {
            const draft = {
                title: DOM.postTitleInput.value,
                excerpt: DOM.postExcerptInput.value,
                content: DOM.postContentInput.value
            };
            localStorage.setItem('dev_insights_draft', JSON.stringify(draft));
            showToast('Draft saved locally!', 'info');
        });

        // Reader Actions
        DOM.readerLikeBtn.addEventListener('click', () => {
            if (state.currentReadingPostId) toggleLike(state.currentReadingPostId);
        });

        DOM.readerBookmarkBtn.addEventListener('click', () => {
            if (state.currentReadingPostId) toggleBookmark(state.currentReadingPostId);
        });

        DOM.readerShareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Article link copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Article ready to share', 'info');
            });
        });

        // Comments Form
        DOM.commentForm.addEventListener('submit', handleAddComment);

        // Newsletter Form
        DOM.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = DOM.newsletterEmail.value;
            showToast(`Thank you! ${email} subscribed successfully.`, 'success');
            DOM.newsletterForm.reset();
        });

        // Reset Data Link
        DOM.footerResetData.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Reset sample blog articles back to defaults?')) {
                localStorage.removeItem('dev_insights_posts');
                state.posts = INITIAL_SEED_POSTS;
                savePostsToStorage();
                renderApp();
                showToast('Sample data restored', 'info');
            }
        });

        // Escape Key Modal Listener
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeReaderModal();
                closeWriteModal();
                closeBookmarksModal();
                closeProfileModal();
                closeAuthModal();
            }
        });

        // Backdrop click to close modals
        [DOM.readerModal, DOM.writeModal, DOM.bookmarksModal, DOM.profileModal, DOM.authModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                    }
                });
            }
        });
    }

    // --------------------------------------------------------------------------
    // 11. Expose Global API for Inline Event Attributes
    // --------------------------------------------------------------------------
    window.DevInsights = {
        openReader: openReaderModal,
        closeBookmarksModal: closeBookmarksModal,
        closeProfileModal: closeProfileModal,
        toggleLike: toggleLike,
        toggleBookmark: toggleBookmark,
        filterByTag: filterByTag,
        openBookmarksModal: openBookmarksModal,
        deleteUserPost: deleteUserPost,
        getFallback: getSvgFallbackImage
    };

    // --------------------------------------------------------------------------
    // 12. App Initialization
    // --------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        initStorage();
        attachEventListeners();
        renderApp();

        // Restore draft if available
        const savedDraft = localStorage.getItem('dev_insights_draft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (draft.title) DOM.postTitleInput.value = draft.title;
                if (draft.excerpt) DOM.postExcerptInput.value = draft.excerpt;
                if (draft.content) DOM.postContentInput.value = draft.content;
            } catch (e) { }
        }
    });

})();
