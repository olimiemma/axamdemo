/**
 * AXAM Demo — Browse Module
 * Subject > Course > Lecture browser using mock data.
 * Fully functional — no backend needed.
 */
const BrowseModule = (() => {
  let state = { level: 'subjects' };
  let initialized = false;
  let searchTimeout = null;

  function init() {
    if (initialized && state.level === 'subjects') {
      render();
      return;
    }
    initialized = true;
    state = { level: 'subjects' };
    render();
  }

  // ── Data accessors (from mock data) ────────────────────────
  function getSubjects() {
    return AXAM.MOCK_SUBJECTS.map(s => ({
      name: s.name,
      icon: s.icon,
      course_count: s.course_count,
      lecture_count: s.lecture_count,
    }));
  }

  function getCourses(subjectName) {
    const s = AXAM.MOCK_SUBJECTS.find(x => x.name === subjectName);
    if (!s) return [];
    return s.courses.map(c => ({
      code: c.code,
      display_name: c.display_name,
      lecture_count: c.lecture_count,
    }));
  }

  function getLectures(subjectName, courseCode) {
    const s = AXAM.MOCK_SUBJECTS.find(x => x.name === subjectName);
    if (!s) return [];
    const c = s.courses.find(x => x.code === courseCode);
    if (!c) return [];
    return c.lectures;
  }

  // ── Navigation ─────────────────────────────────────────────
  function showCourses(subject) {
    state = { level: 'courses', subject };
    render();
  }

  function showLectures(subject, code) {
    state = { level: 'lectures', subject, courseCode: code };
    render();
  }

  function showDetail(videoId) {
    const lecture = AXAM.LECTURE_BY_ID[videoId];
    if (!lecture) {
      AXAM.toast('Lecture not found in demo data', 'error');
      return;
    }
    state = {
      level: 'detail',
      subject: state.subject || lecture.subject,
      courseCode: state.courseCode || lecture.course_code,
      lecture,
    };
    render();
  }

  function goBack() {
    if (state.level === 'detail') {
      state = { level: 'lectures', subject: state.subject, courseCode: state.courseCode };
    } else if (state.level === 'lectures') {
      state = { level: 'courses', subject: state.subject };
    } else if (state.level === 'courses' || state.level === 'search') {
      state = { level: 'subjects' };
    }
    render();
  }

  function goToSubjects() {
    state = { level: 'subjects' };
    document.getElementById('browse-search').value = '';
    render();
  }

  // ── Search ─────────────────────────────────────────────────
  function searchFromHome(query) {
    state = { level: 'search', query };
    const searchInput = document.getElementById('browse-search');
    if (searchInput) searchInput.value = query;
    performSearch(query);
  }

  function onSearch(value) {
    clearTimeout(searchTimeout);
    if (!value.trim()) {
      if (state.level === 'search') state = { level: 'subjects' };
      render();
      return;
    }
    searchTimeout = setTimeout(() => performSearch(value.trim()), 300);
  }

  function performSearch(query) {
    const q = query.toLowerCase().split(/\s+/);
    const results = AXAM.ALL_LECTURES.filter(l => {
      const title = l.title.toLowerCase();
      return q.every(w => title.includes(w));
    }).slice(0, 60);
    state = { level: 'search', query, results };
    render();
  }

  // ── Render ─────────────────────────────────────────────────
  function render() {
    renderBreadcrumb();
    const content = document.getElementById('browse-content');
    const searchWrap = document.getElementById('browse-search-wrap');

    switch (state.level) {
      case 'subjects':
        searchWrap.style.display = 'block';
        content.innerHTML = renderSubjects();
        break;
      case 'courses':
        searchWrap.style.display = 'block';
        content.innerHTML = renderCourses();
        break;
      case 'lectures':
        searchWrap.style.display = 'block';
        content.innerHTML = renderLectures();
        break;
      case 'detail':
        searchWrap.style.display = 'none';
        content.innerHTML = renderDetail();
        break;
      case 'search':
        searchWrap.style.display = 'block';
        content.innerHTML = renderSearchResults();
        break;
    }
  }

  // ── Breadcrumb ─────────────────────────────────────────────
  function renderBreadcrumb() {
    const el = document.getElementById('browse-breadcrumb');
    let crumbs = [];

    if (state.level === 'subjects') {
      el.innerHTML = '';
      return;
    }

    crumbs.push(`<span class="breadcrumb-item" onclick="BrowseModule.goToSubjects()">All Subjects</span>`);

    if (state.level === 'search') {
      crumbs.push(`<span class="breadcrumb-sep">\u203A</span>`);
      crumbs.push(`<span class="breadcrumb-current">Search: "${AXAM.esc(state.query)}"</span>`);
    }

    if (state.subject) {
      crumbs.push(`<span class="breadcrumb-sep">\u203A</span>`);
      if (state.level === 'courses') {
        crumbs.push(`<span class="breadcrumb-current">${AXAM.esc(state.subject)}</span>`);
      } else {
        crumbs.push(`<span class="breadcrumb-item" onclick="BrowseModule.showCourses('${jsStr(state.subject)}')">${AXAM.esc(state.subject)}</span>`);
      }
    }

    if (state.courseCode && state.level !== 'courses') {
      const courseName = getCourseName(state.subject, state.courseCode);
      crumbs.push(`<span class="breadcrumb-sep">\u203A</span>`);
      if (state.level === 'lectures') {
        crumbs.push(`<span class="breadcrumb-current">${AXAM.esc(courseName)}</span>`);
      } else {
        crumbs.push(`<span class="breadcrumb-item" onclick="BrowseModule.showLectures('${jsStr(state.subject)}','${jsStr(state.courseCode)}')">${AXAM.esc(courseName)}</span>`);
      }
    }

    if (state.level === 'detail' && state.lecture) {
      crumbs.push(`<span class="breadcrumb-sep">\u203A</span>`);
      crumbs.push(`<span class="breadcrumb-current">${AXAM.esc(state.lecture.title.substring(0, 60))}</span>`);
    }

    el.innerHTML = crumbs.join('');
  }

  function getCourseName(subject, code) {
    const s = AXAM.MOCK_SUBJECTS.find(x => x.name === subject);
    if (!s) return code;
    const c = s.courses.find(x => x.code === code);
    return c ? c.display_name : code;
  }

  // ── Helper ─────────────────────────────────────────────────
  function jsStr(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"'); }

  // ── Render: Subjects ───────────────────────────────────────
  function renderSubjects() {
    const subjects = getSubjects();
    if (!subjects.length) {
      return '<div class="empty-state"><div class="empty-icon">\uD83D\uDCDA</div><div class="empty-text">No subjects loaded</div></div>';
    }
    const cards = subjects.map(s => `
      <div class="card card-clickable subject-card" onclick="BrowseModule.showCourses('${jsStr(s.name)}')">
        <div class="subject-icon">${s.icon}</div>
        <div class="subject-name">${AXAM.esc(s.name)}</div>
        <div class="subject-meta">${s.lecture_count} lectures \u00B7 ${s.course_count} courses</div>
      </div>
    `).join('');
    return `<div class="card-grid">${cards}</div>`;
  }

  // ── Render: Courses ────────────────────────────────────────
  function renderCourses() {
    const courses = getCourses(state.subject);
    if (!courses.length) {
      return '<div class="empty-state"><div class="empty-text">No courses found</div></div>';
    }
    const cards = courses.map(c => `
      <div class="card card-clickable course-card" onclick="BrowseModule.showLectures('${jsStr(state.subject)}','${jsStr(c.code)}')">
        <div style="font-size:28px;">\uD83D\uDCD6</div>
        <div class="course-info">
          <div class="course-name">${AXAM.esc(c.display_name)}</div>
          <div class="course-count">${c.lecture_count} lecture${c.lecture_count !== 1 ? 's' : ''}</div>
        </div>
        <div style="color:var(--text-muted);font-size:18px;">\u203A</div>
      </div>
    `).join('');
    return `<div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">${cards}</div>`;
  }

  // ── Render: Lectures ───────────────────────────────────────
  function renderLectures() {
    const lectures = getLectures(state.subject, state.courseCode);
    return renderLectureList(lectures);
  }

  function renderLectureList(lectures) {
    if (!lectures.length) {
      return '<div class="empty-state"><div class="empty-text">No lectures found</div></div>';
    }
    const items = lectures.map(l => `
      <div class="card card-clickable lecture-card" onclick="BrowseModule.showDetail('${jsStr(l.video_id)}')">
        <div style="font-size:24px;">\uD83C\uDFAC</div>
        <div class="lecture-info">
          <div class="lecture-title" title="${AXAM.esc(l.title)}">${AXAM.esc(l.title)}</div>
          <div class="lecture-meta">
            ${AXAM.formatDuration(l.duration)} \u00B7 ${AXAM.formatViews(l.view_count)} views
            ${l.subject ? ` \u00B7 <span class="badge badge-accent">${AXAM.esc(l.subject)}</span>` : ''}
          </div>
        </div>
        <div style="color:var(--text-muted);font-size:18px;">\u203A</div>
      </div>
    `).join('');
    return `<div style="display:flex;flex-direction:column;gap:8px;">${items}</div>`;
  }

  // ── Render: Detail ─────────────────────────────────────────
  function renderDetail() {
    const l = state.lecture;
    if (!l) return '<div class="empty-state"><div class="empty-text">Lecture not found</div></div>';

    return `
      <div class="lecture-detail">
        <div class="lecture-detail-title">${AXAM.esc(l.title)}</div>
        <div class="lecture-detail-meta">
          <div class="detail-meta-item">\u23F1\uFE0F ${AXAM.formatDuration(l.duration)}</div>
          <div class="detail-meta-item">\uD83D\uDC41\uFE0F ${AXAM.formatViews(l.view_count)} views</div>
          <div class="detail-meta-item"><span class="badge badge-accent">${AXAM.esc(l.subject)}</span></div>
          ${l.course_code ? `<div class="detail-meta-item">\uD83D\uDCD6 MIT ${AXAM.esc(l.course_code)}</div>` : ''}
        </div>
        ${l.url ? `<div class="mb-4"><a href="${AXAM.esc(l.url)}" target="_blank" style="font-size:13px;">\uD83D\uDD17 Watch on YouTube (online)</a></div>` : ''}
        <div class="lecture-detail-actions">
          <button class="btn btn-primary" onclick="BrowseModule.chatAbout('${jsStr(l.video_id)}', '${jsStr(l.title)}')">
            \uD83D\uDCAC Chat about this lecture
          </button>
          <button class="btn btn-outline" onclick="BrowseModule.examAbout('${jsStr(l.video_id)}', '${jsStr(l.title)}')">
            \uD83D\uDCDD Generate exam questions
          </button>
          <button class="btn btn-secondary" onclick="BrowseModule.goBack()">
            \u2190 Back
          </button>
        </div>
      </div>
    `;
  }

  // ── Render: Search Results ─────────────────────────────────
  function renderSearchResults() {
    const results = state.results || [];
    if (!results.length) {
      return `<div class="empty-state"><div class="empty-icon">\uD83D\uDD0D</div><div class="empty-text">No lectures match "${AXAM.esc(state.query)}"</div><div class="empty-hint">Try broader terms \u2014 the demo includes a sample of the full 7,600+ lecture catalogue</div></div>`;
    }
    return `
      <div class="mb-2 text-sm text-muted">${results.length} result${results.length !== 1 ? 's' : ''}</div>
      ${renderLectureList(results)}
    `;
  }

  // ── Cross-module actions ───────────────────────────────────
  function chatAbout(videoId, title) {
    AXAM.navigate('chat');
    ChatModule.sendMessage(`Tell me about the lecture "${title}"`);
  }

  function examAbout(videoId, title) {
    AXAM.navigate('exam');
    if (typeof ExamModule !== 'undefined') {
      ExamModule.prefill(title, videoId);
    }
  }

  return {
    init,
    showCourses,
    showLectures,
    showDetail,
    goToSubjects,
    goBack,
    onSearch,
    searchFromHome,
    chatAbout,
    examAbout,
  };
})();
