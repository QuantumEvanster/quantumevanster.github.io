// Page Transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-transition-enter');

    document.querySelectorAll('a').forEach(anchor => {
        // Only intercept internal links ending in .html
        if (anchor.href && anchor.href.includes('.html') && !anchor.target) {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = anchor.href;
                document.body.classList.remove('page-transition-enter');
                document.body.classList.add('page-transition-exit');
                
                setTimeout(() => {
                    window.location.href = target;
                }, 600);
            });
        }
    });
});

// Boot Sequence Logic
const BOOT_LOGS = [
  'MAGI SYSTEM v3.1.7 — INITIALIZING...',
  'CORE MEMORY: 64GB LOADED',
  'NEURAL INTERFACE: ACTIVE',
  'AT FIELD: NOMINAL',
  'PILOT: EVAN RAHMAN — DETECTED',
  'SYNCHRONIZATION: 91%',
  'CLEARANCE LEVEL 3: GRANTED',
  '> BOOT COMPLETE. DEPLOYING INTERFACE.'
];

document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot');
    if (bootScreen) {
        const hasLoaded = sessionStorage.getItem('magi-loaded');
        
        let isReload = false;
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            isReload = navEntries[0].type === 'reload';
        } else if (window.performance && window.performance.navigation) {
            isReload = window.performance.navigation.type === 1;
        }
        
        if (!hasLoaded || isReload) {
            sessionStorage.setItem('magi-loaded', 'true');
            
            const bootLinesContainer = document.getElementById('boot-lines');
            const bootProgress = document.getElementById('bp');
            const bootProgressText = document.getElementById('bpct');
            let bootIndex = 0;

            function runBootSequence() {
                if (bootIndex >= BOOT_LOGS.length) {
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        
                        // Retrigger the signal spike enter animation
                        document.body.classList.remove('page-transition-enter');
                        void document.body.offsetWidth; // trigger reflow
                        document.body.classList.add('page-transition-enter');
                    }, 500);
                    return;
                }
                
                const line = document.createElement('div');
                line.textContent = BOOT_LOGS[bootIndex];
                line.style.color = bootIndex === BOOT_LOGS.length - 1 ? '#50ff10' : '#ec7420';
                bootLinesContainer.appendChild(line);
                
                bootIndex++;
                const percentage = Math.round((bootIndex / BOOT_LOGS.length) * 100);
                bootProgress.style.width = percentage + '%';
                bootProgressText.textContent = percentage + '%';
                
                setTimeout(runBootSequence, 150 + Math.random() * 200);
            }
            
            // Start sequence after a small delay to ensure rendering
            setTimeout(runBootSequence, 300);
            
        } else {
            bootScreen.style.display = 'none';
        }
    }
});


// Emergency Logic
function triggerEmergency() {
    const emergencyOverlay = document.getElementById('emergency-overlay');
    const emergencyFlash = document.getElementById('emergency-flash');
    const waConfirmBox = document.getElementById('wa-confirm-box');
    
    if (emergencyOverlay) {
        if (emergencyFlash) emergencyFlash.style.display = '';
        if (waConfirmBox) waConfirmBox.style.display = 'none';
        
        emergencyOverlay.classList.add('active');
        setTimeout(() => {
            emergencyOverlay.classList.remove('active');
        }, 3000); // 3 seconds
    }
}

// Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu-overlay');
    const mobileClose = document.getElementById('mobile-menu-close');

    if (mobileBtn && mobileMenu && mobileClose) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        });

        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        });
    }
});

// WhatsApp Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('wa-slider-container');
    const sliderThumb = document.getElementById('wa-slider-thumb');
    const sliderTrack = document.getElementById('wa-slider-track');
    const sliderText = document.getElementById('wa-slider-text');
    
    const emergencyOverlay = document.getElementById('emergency-overlay');
    const emergencyFlash = document.getElementById('emergency-flash');
    const waConfirmBox = document.getElementById('wa-confirm-box');
    const btnExecute = document.getElementById('wa-btn-execute');
    const btnAbort = document.getElementById('wa-btn-abort');

    if (sliderContainer && sliderThumb) {
        let isDragging = false;
        let startX = 0;
        let thumbWidth = sliderThumb.offsetWidth;
        let maxDrag = sliderContainer.offsetWidth - thumbWidth;

        function updateSliderPosition(x) {
            let boundedX = Math.max(0, Math.min(x, maxDrag));
            sliderThumb.style.transform = `translateX(${boundedX}px)`;
            sliderTrack.style.width = `${boundedX + thumbWidth / 2}px`;
            
            const opacity = 1 - (boundedX / maxDrag);
            sliderText.style.opacity = Math.max(0.1, opacity);
            
            return boundedX;
        }

        function handleDragStart(e) {
            if (e.target.closest('#wa-slider-thumb')) {
                isDragging = true;
                startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                const style = window.getComputedStyle(sliderThumb);
                const matrix = new DOMMatrixReadOnly(style.transform);
                startX -= matrix.m41;
                
                sliderThumb.style.transition = 'none';
                sliderTrack.style.transition = 'none';
                document.body.style.userSelect = 'none';
            }
        }

        function handleDragMove(e) {
            if (!isDragging) return;
            // e.preventDefault(); // Prevent scrolling while dragging on mobile
            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const x = currentX - startX;
            updateSliderPosition(x);
        }

        function handleDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            
            const style = window.getComputedStyle(sliderThumb);
            const matrix = new DOMMatrixReadOnly(style.transform);
            const finalX = matrix.m41;
            
            if (finalX >= maxDrag * 0.95) {
                // Success
                sliderThumb.style.transform = `translateX(${maxDrag}px)`;
                sliderTrack.style.width = `100%`;
                triggerWaEmergency();
            } else {
                // Snap back
                sliderThumb.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                sliderTrack.style.transition = 'width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                sliderThumb.style.transform = 'translateX(0px)';
                sliderTrack.style.width = '0px';
                sliderText.style.opacity = '1';
            }
        }

        window.addEventListener('resize', () => {
            thumbWidth = sliderThumb.offsetWidth;
            maxDrag = sliderContainer.offsetWidth - thumbWidth;
            if (!isDragging && sliderThumb.style.transform === 'translateX(0px)') {
                sliderTrack.style.width = '0px';
            }
        });

        sliderThumb.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);

        sliderThumb.addEventListener('touchstart', handleDragStart, {passive: true});
        document.addEventListener('touchmove', handleDragMove, {passive: false});
        document.addEventListener('touchend', handleDragEnd);
    }

    function triggerWaEmergency() {
        if (emergencyOverlay && waConfirmBox && emergencyFlash) {
            emergencyFlash.style.display = 'none';
            waConfirmBox.style.display = 'flex';
            emergencyOverlay.classList.add('active');
        }
    }
    
    function resetWaEmergency() {
        if (emergencyOverlay && waConfirmBox && emergencyFlash) {
            emergencyOverlay.classList.remove('active');
            
            setTimeout(() => {
                waConfirmBox.style.display = 'none';
                emergencyFlash.style.display = '';
                
                if (sliderThumb && sliderTrack && sliderText) {
                    sliderThumb.style.transition = 'transform 0.3s ease';
                    sliderTrack.style.transition = 'width 0.3s ease';
                    sliderThumb.style.transform = 'translateX(0px)';
                    sliderTrack.style.width = '0px';
                    sliderText.style.opacity = '1';
                }
            }, 300);
        }
    }

    if (btnAbort) {
        btnAbort.addEventListener('click', resetWaEmergency);
    }
    
    if (btnExecute) {
        btnExecute.addEventListener('click', () => {
            window.open('https://wa.me/918712903315', '_blank');
            resetWaEmergency();
        });
    }
});

// Live Terminal Feed Logic
document.addEventListener('DOMContentLoaded', () => {
    const terminalFeed = document.getElementById('live-terminal-feed');
    if (!terminalFeed) return;

    const LOG_MESSAGES = [
        '> RESOLVING DNS QUERIES VIA PI-HOLE... [OK]',
        '> STARTING SURICATA IDS... [ONLINE]',
        '> ESTABLISHING SSH SESSION (2FA)... [SUCCESS]',
        '> PING HOMELAB GATEWAY... [14ms]',
        '> RENEWING SSL CERTIFICATES... [OK]',
        '> RESOLVING DEPENDENCY GRAPH... [RESOLVED]',
        '> RUNNING NIGHTLY BACKUP SCRIPT... [OK]',
        '> CACHE HIT RATIO OPTIMIZED... [98%]',
        '> SYNCING WAZUH AGENT LOGS... [SYNCED]',
        '> RESTARTING DOCKER CONTAINERS... [OK]',
        '> CAPTURING PACKETS (WIRESHARK)... [PASSED]',
        '> OVERRIDING SYSTEM LIMITERS... [ACTIVE]'
    ];

    const BERSERK_MESSAGES = [
        '[CRITICAL] FATAL ERROR in react-dom.production.min.js: OOM_KILL',
        'Traceback (most recent call last):',
        '  File "/usr/local/lib/python3.10/threading.py", line 973, in _bootstrap_inner',
        '    self.run()',
        '  File "/usr/local/lib/python3.10/threading.py", line 910, in run',
        '    self._target(*self._args, **self._kwargs)',
        'django.db.utils.OperationalError: FATAL: remaining connection slots are reserved',
        '[ERROR] Docker container magi_core_01 exited with code 137',
        'nginx: [emerg] open() "/etc/nginx/nginx.conf" failed (2: No such file)',
        '[WARN] CPU Temperature exceeding thermal threshold: 98°C',
        'kubelet failed to garbage collect pod: context deadline exceeded',
        'panic: runtime error: invalid memory address or nil pointer dereference',
        '[FATAL] Core meltdown imminent. System halting...',
        '> OVERRIDING SYSTEM LIMITERS... [FAILED]',
        'ValueError: invalid literal for int() with base 10: "undefined"',
        'UnhandledPromiseRejectionWarning: MongoNetworkError: failed to connect to server'
    ];

    let messageIndex = 0;
    
    function addTerminalLine() {
        if (!document.getElementById('live-terminal-feed')) return; // Safety check
        
        const line = document.createElement('div');
        const isBerserk = window.magiAlertState === 'RED';
        
        if (isBerserk) {
            const randomMsg = BERSERK_MESSAGES[Math.floor(Math.random() * BERSERK_MESSAGES.length)];
            line.innerHTML = `<span class="text-hazard-red font-bold">${randomMsg}</span>`;
            terminalFeed.appendChild(line);
            
            // Allow slightly more lines on screen during chaos
            if (terminalFeed.children.length > 8) {
                terminalFeed.removeChild(terminalFeed.firstElementChild);
            }
            
            // Random delay between 20ms and 80ms for chaotic spamming
            const nextDelay = 20 + Math.random() * 60;
            setTimeout(addTerminalLine, nextDelay);
        } else {
            const text = LOG_MESSAGES[messageIndex];
            
            // Add some color coding for realism
            if (text.includes('[OK]') || text.includes('[SUCCESS]') || text.includes('[ONLINE]') || text.includes('[PASSED]') || text.includes('[SYNCED]') || text.includes('[RESOLVED]')) {
                line.innerHTML = text.replace(/\[(.*?)\]/, '<span style="color: #50ff10">[$1]</span>');
            } else if (text.includes('[ACTIVE]')) {
                line.innerHTML = text.replace(/\[(.*?)\]/, '<span style="color: #ff1a1a" class="animate-pulse">[$1]</span>');
            } else {
                line.innerHTML = text.replace(/\[(.*?)\]/, '<span style="color: #ec7420">[$1]</span>');
            }
            
            terminalFeed.appendChild(line);
            
            // Keep only max 5 lines to simulate rolling
            if (terminalFeed.children.length > 5) {
                terminalFeed.removeChild(terminalFeed.firstElementChild);
            }
            
            messageIndex = (messageIndex + 1) % LOG_MESSAGES.length;
            
            // Random delay between 400ms and 1500ms
            const nextDelay = 400 + Math.random() * 1100;
            setTimeout(addTerminalLine, nextDelay);
        }
    }
    
    // Initial lines
    addTerminalLine();
    setTimeout(addTerminalLine, 500);
});

// Clock Logic
document.addEventListener('DOMContentLoaded', () => {
    const clockContainer = document.getElementById('magi-clock-container');
    const clockTime = document.getElementById('magi-clock-time');
    const clockSec = document.getElementById('magi-clock-sec');
    const clockDay = document.getElementById('magi-clock-day');
    const clockDate = document.getElementById('magi-clock-date');
    const clockAlert = document.getElementById('magi-clock-alert');
    const clockDateGroup = document.getElementById('magi-clock-date-group');

    if (!clockTime) return;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    function createDigitHTML(char) {
        if (char === ':') {
            return `<span class="relative inline-block text-center mx-[2px]">
                        <span class="opacity-10 relative z-0">:</span>
                        <span class="absolute top-0 right-0 z-10">${char}</span>
                    </span>`;
        }
        return `<span class="relative inline-block text-right">
                    <span class="opacity-10 relative z-0">8</span>
                    <span class="absolute top-0 right-0 z-10">${char}</span>
                </span>`;
    }

    function updateClock() {
        // Get current time
        const d = new Date();
        // UTC time in ms
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        // IST offset is +5:30
        const nd = new Date(utc + (3600000 * 5.5));
        
        const h = String(nd.getHours()).padStart(2, '0');
        const m = String(nd.getMinutes()).padStart(2, '0');
        const s = String(nd.getSeconds()).padStart(2, '0');
        
        const timeStr = `${h}:${m}`;
        
        if (clockTime) clockTime.innerHTML = timeStr.split('').map(c => createDigitHTML(c)).join('');
        if (clockSec) clockSec.innerHTML = s.split('').map(c => createDigitHTML(c)).join('');
        if (clockDay) clockDay.textContent = days[nd.getDay()];
        if (clockDate) clockDate.textContent = `${months[nd.getMonth()]} ${nd.getDate()}`;
        
        const seconds = nd.getSeconds();
        let state = 'AMBER';
        if (seconds >= 55) state = 'RED';
        else if (seconds === 0 || seconds === 1) state = 'GREEN';
        
        window.magiAlertState = state;

        const colorMap = {
            'AMBER': { primary: 'text-[#ff9f1a]', secondary: 'text-[#ffb347]', secAlpha: 'text-[#ffb347]/80', dateAlpha: 'text-[#ffb347]/70', border: 'border-[#ffb347]/20', bg: 'bg-[#050505]', shadow: 'rgba(255,159,26', alertOpacity: '0', siren: false },
            'RED': { primary: 'text-hazard-red', secondary: 'text-hazard-red', secAlpha: 'text-hazard-red', dateAlpha: 'text-hazard-red', border: 'border-hazard-red', bg: 'bg-[#150000]', shadow: 'rgba(168,8,8', alertOpacity: '1', siren: true },
            'GREEN': { primary: 'text-[#50ff10]', secondary: 'text-[#50ff10]', secAlpha: 'text-[#50ff10]', dateAlpha: 'text-[#50ff10]/70', border: 'border-[#50ff10]/50', bg: 'bg-[#001500]', shadow: 'rgba(80,255,16', alertOpacity: '0', siren: false }
        };

        const config = colorMap[state];

        if (clockTime) {
            ['text-[#ff9f1a]', 'text-hazard-red', 'text-[#50ff10]'].forEach(c => clockTime.classList.remove(c));
            clockTime.classList.add(config.primary);
            clockTime.style.textShadow = `0 0 ${state === 'AMBER' ? '12px' : '20px'} ${config.shadow},${state === 'AMBER' ? '0.6' : '0.8'})`;
            
            if (config.siren) clockTime.classList.add('animate-siren-flash');
            else clockTime.classList.remove('animate-siren-flash');
        }

        if (clockSec) {
            ['text-[#ffb347]/80', 'text-hazard-red', 'text-[#50ff10]'].forEach(c => clockSec.classList.remove(c));
            clockSec.classList.add(config.secAlpha);
            if (config.siren) clockSec.classList.add('animate-siren-flash');
            else clockSec.classList.remove('animate-siren-flash');
        }

        if (clockDateGroup) {
            ['text-[#ffb347]/70', 'text-hazard-red', 'text-[#50ff10]/70'].forEach(c => clockDateGroup.classList.remove(c));
            clockDateGroup.classList.add(config.dateAlpha);
        }

        if (clockDay) {
            ['text-[#ffb347]', 'text-hazard-red', 'text-[#50ff10]'].forEach(c => clockDay.classList.remove(c));
            clockDay.classList.add(config.secondary);
        }

        if (clockContainer) {
            ['border-[#ffb347]/20', 'border-hazard-red', 'border-[#50ff10]/50', 'animate-bg-siren'].forEach(c => clockContainer.classList.remove(c));
            ['bg-[#050505]', 'bg-[#150000]', 'bg-[#001500]'].forEach(c => clockContainer.classList.remove(c));
            clockContainer.classList.add(config.border, config.bg);
            if (config.siren) clockContainer.classList.add('animate-bg-siren');
            else clockContainer.style.boxShadow = `inset 0 0 ${state === 'AMBER' ? '20px' : '40px'} ${config.shadow},${state === 'AMBER' ? '0.05' : '0.2'})`;
        }

        if (clockAlert) clockAlert.style.opacity = config.alertOpacity;
    }

    updateClock();
    setInterval(updateClock, 1000);
});

// Decryption Effect Logic
document.addEventListener('DOMContentLoaded', () => {
    const decryptElements = document.querySelectorAll('.decrypt-text');
    if (decryptElements.length === 0) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    function runDecryptAnimation(element) {
        const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
        if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
        }
        
        let iterations = 0;
        let solvedIndex = 0;
        
        // Use a faster interval for the matrix/evangelion feel
        const interval = setInterval(() => {
            let currentHTML = '';
            
            for (let i = 0; i < originalText.length; i++) {
                if (originalText[i] === '\n') {
                    currentHTML += '<br/>';
                    continue;
                }
                
                if (i < solvedIndex || originalText[i] === ' ' || originalText[i] === '.' || originalText[i] === ',') {
                    currentHTML += `<span class="text-nominal-green">${originalText[i]}</span>`;
                } else {
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    const colorClass = Math.random() > 0.5 ? 'text-hazard-red' : 'text-primary';
                    currentHTML += `<span class="${colorClass}">${randomChar}</span>`;
                }
            }
            
            element.innerHTML = currentHTML;
            
            iterations++;
            // Solve a chunk of characters every few frames to simulate sequential decoding
            if (iterations % 2 === 0) {
                // Determine how many characters to solve per step so it completes in a reasonable time
                solvedIndex += Math.max(1, Math.floor(originalText.length / 40));
            }
            
            if (solvedIndex >= originalText.length) {
                clearInterval(interval);
                element.innerHTML = `<span class="text-nominal-green">${originalText.replace(/\n/g, '<br/>')}</span>`;
            }
        }, 30);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runDecryptAnimation(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    decryptElements.forEach(el => observer.observe(el));
});

// GitHub Heatmap Logic
document.addEventListener('DOMContentLoaded', () => {
    const heatmapContainer = document.getElementById('github-heatmap');
    const commitReadout = document.getElementById('commits-ytd-readout');
    
    if (!heatmapContainer) return;

    async function fetchAndRenderGitHubHeatmap() {
        try {
            // Using a stable alternative API
            const response = await fetch('https://gh-calendar.rschristian.dev/user/QuantumEvanster');
            if (!response.ok) throw new Error('Failed to fetch');
            
            const data = await response.json();
            const weeks = data.contributions;
            
            heatmapContainer.innerHTML = ''; // clear loading text
            
            // We only want to show the last ~40 weeks to fit the container nicely
            const weeksToShow = weeks.slice(-40);
            
            weeksToShow.forEach(week => {
                const colDiv = document.createElement('div');
                colDiv.className = 'flex flex-col gap-[3px]';
                
                week.forEach(day => {
                    const cell = document.createElement('div');
                    cell.className = 'w-[12px] h-[12px] rounded-[2px] transition-colors duration-300';
                    
                    // Map intensity (0-4) to Evangelion Toxic Green & Cyan theme
                    if (day.intensity === '0' || day.intensity === 0) {
                        cell.classList.add('bg-[#0a150a]'); // Very dark green
                    } else if (day.intensity === '1' || day.intensity === 1) {
                        cell.classList.add('bg-[#153a1a]');
                    } else if (day.intensity === '2' || day.intensity === 2) {
                        cell.classList.add('bg-[#2a7a40]');
                    } else if (day.intensity === '3' || day.intensity === 3) {
                        cell.classList.add('bg-[#6fa8dc]', 'shadow-[0_0_3px_rgba(111,168,220,0.5)]'); // Cyan
                    } else {
                        cell.classList.add('bg-[#50ff10]', 'shadow-[0_0_6px_#50ff10]'); // Toxic Green Glow
                    }
                    
                    // Add tooltip title for hover
                    if (day.count > 0) {
                        cell.title = `${day.count} commits on ${day.date}`;
                    }
                    
                    colDiv.appendChild(cell);
                });
                
                heatmapContainer.appendChild(colDiv);
            });
            
            const absoluteTotal = data.total;
            
            if (commitReadout) {
                // Animate the number counting up
                let current = 0;
                const increment = Math.ceil(absoluteTotal / 20) || 1;
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= absoluteTotal) {
                        current = absoluteTotal;
                        clearInterval(counter);
                    }
                    commitReadout.textContent = current.toLocaleString();
                }, 40);
            }
            
        } catch (error) {
            console.error('Heatmap error:', error);
            if (error.message && (error.message.includes('Content Security Policy') || error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
                heatmapContainer.innerHTML = '<div class="text-[10px] text-hazard-red font-bold animate-pulse uppercase tracking-widest text-center mt-4">ERROR: EXTERNAL SYNC BLOCKED BY SYSTEM SECURITY POLICY (CSP)</div>';
            } else {
                heatmapContainer.innerHTML = '<div class="text-[10px] text-hazard-red font-bold text-center mt-4">ERROR: FAILED TO SYNC REPOSITORY DATA</div>';
            }
            if (commitReadout) commitReadout.textContent = 'ERR';
        }
    }

    fetchAndRenderGitHubHeatmap();
});

// Bento Grid Logic
document.addEventListener('DOMContentLoaded', () => {
    const bentoPanels = document.querySelectorAll('.bento-panel');
    
    bentoPanels.forEach(panel => {
        panel.addEventListener('click', (e) => {
            // Prevent triggering if a link was clicked
            if (e.target.closest('a')) return;
            
            const isExpanded = panel.classList.contains('is-expanded');
            const panelArray = Array.from(bentoPanels);
            
            // Close all panels first
            panelArray.forEach((p, i) => {
                p.classList.remove(
                    'is-expanded', 
                    'lg:col-span-2', 
                    'lg:row-span-2',
                    'lg:col-start-2',
                    'lg:row-start-1',
                    'lg:row-start-2',
                    'lg:row-start-3'
                );
                
                // Remove any dynamically added order classes
                for (let o = 1; o <= 12; o++) {
                    p.classList.remove(`lg:order-${o}`);
                }
                
                p.classList.add('lg:col-span-1');
                
                const expContent = p.querySelector('.expanded-content');
                if (expContent) {
                    expContent.classList.add('opacity-0');
                    setTimeout(() => {
                        if (!p.classList.contains('is-expanded')) {
                            expContent.classList.add('hidden');
                            expContent.classList.remove('flex');
                        }
                    }, 300); // Wait for opacity transition before hiding
                }
            });
            
            // If the clicked panel wasn't already expanded, expand it
            if (!isExpanded) {
                // Find grid coordinates (1-indexed) based on a 3-column layout
                const index = panelArray.indexOf(panel);
                const row = Math.floor(index / 3) + 1;
                const col = (index % 3) + 1;

                panel.classList.add('is-expanded', 'lg:col-span-2', 'lg:row-span-2');
                panel.classList.remove('lg:col-span-1');

                if (col === 2) {
                    // Middle card: Expand to the left by placing it before the first column in its row
                    panelArray.forEach((p, i) => {
                        const pRow = Math.floor(i / 3) + 1;
                        const pCol = (i % 3) + 1;
                        let orderValue;
                        if (pRow === row) {
                            if (pCol === 2) orderValue = (pRow - 1) * 3 + 1;      // Middle becomes first
                            else if (pCol === 1) orderValue = (pRow - 1) * 3 + 2; // Left becomes second
                            else if (pCol === 3) orderValue = (pRow - 1) * 3 + 3; // Right stays third
                        } else {
                            orderValue = i + 1; // Unaffected rows maintain normal order
                        }
                        p.classList.add(`lg:order-${orderValue}`);
                    });
                } else if (col === 3) {
                    // Right card: Expand to the left by explicitly placing it at column 2
                    panel.classList.add('lg:col-start-2', `lg:row-start-${row}`);
                }
                
                const expContent = panel.querySelector('.expanded-content');
                if (expContent) {
                    expContent.classList.remove('hidden');
                    expContent.classList.add('flex');
                    // Small timeout to allow display:flex to apply before transitioning opacity
                    setTimeout(() => {
                        expContent.classList.remove('opacity-0');
                    }, 50);
                }
                
                // Optional: Scroll to the expanded panel to ensure it's in view
                setTimeout(() => {
                    const rect = panel.getBoundingClientRect();
                    const navHeight = 80; // Account for fixed navbar
                    if (rect.top < navHeight || rect.bottom > window.innerHeight) {
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        window.scrollTo({
                            top: rect.top + scrollTop - navHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 350);
            }
        });
    });
});
