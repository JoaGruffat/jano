// Function to calculate team score for a hole
function calculateTeamScore(score1, score2, par) {
    if (!score1 || !score2) return 0; // Return 0 if either score is missing
    
    // If at least one player is par or better
    if (score1 <= par || score2 <= par) {
        return parseInt(Math.min(score1, score2).toString() + Math.max(score1, score2).toString());
    }
    // If both players are over par
    else {
        return parseInt(Math.max(score1, score2).toString() + Math.min(score1, score2).toString());
    }
}

// Function to determine which team is winning and by how much
function determineLead(teamAScore, teamBScore) {
    if (teamAScore === 0 && teamBScore === 0) return "-";
    const diff = Math.abs(teamAScore - teamBScore);
    if (teamAScore < teamBScore) return `${diff}`;
    if (teamBScore < teamAScore) return `${diff}`;
    return "Tied";
}

// Function to format the lead display
function formatLeadDisplay(teamAScore, teamBScore, cumulativeDiff = 0) {
    if (teamAScore === 0 && teamBScore === 0) return "-";
    const lead = determineLead(teamAScore, teamBScore);
    
    let leadText = "";
    if (teamAScore < teamBScore) {
        leadText = `Blue Team leads by ${lead}`;
    } else if (teamBScore < teamAScore) {
        leadText = `Red Team leads by ${lead}`;
    } else {
        leadText = "Teams are tied";
    }

    if (cumulativeDiff !== 0) {
        leadText += ` (Cumulative: ${Math.abs(cumulativeDiff)})`;
    }

    return leadText;
}

// Function to update all calculations
function updateCalculations() {
    let cumulativeDiff = 0;

    // Update each hole
    const rows = document.querySelectorAll('tbody tr:not(.section-header):not(.lead-row)');
    rows.forEach((row, index) => {
        const par = parseInt(row.querySelector('.par').textContent);
        
        // Get scores for Blue Team
        const teamAPlayer1 = parseInt(row.querySelector('td:nth-child(3) input').value) || 0;
        const teamAPlayer2 = parseInt(row.querySelector('td:nth-child(4) input').value) || 0;
        
        // Get scores for Red Team
        const teamBPlayer1 = parseInt(row.querySelector('td:nth-child(5) input').value) || 0;
        const teamBPlayer2 = parseInt(row.querySelector('td:nth-child(6) input').value) || 0;

        // Calculate team scores
        const teamAScore = calculateTeamScore(teamAPlayer1, teamAPlayer2, par);
        const teamBScore = calculateTeamScore(teamBPlayer1, teamBPlayer2, par);
        
        // Calculate the difference for this hole (positive means Red is ahead)
        const holeDiff = teamAScore - teamBScore;
        cumulativeDiff += holeDiff;

        // Update lead indicator
        const leadRow = row.nextElementSibling;
        const leadCell = leadRow.querySelector('.lead-info');
        const leadText = formatLeadDisplay(teamAScore, teamBScore, cumulativeDiff);
        
        // Set appropriate class based on who's leading
        leadCell.className = 'lead-info';
        if (teamAScore < teamBScore) {
            leadCell.classList.add('blue');
        } else if (teamBScore < teamAScore) {
            leadCell.classList.add('red');
        } else {
            leadCell.classList.add('green');
        }
        
        leadCell.textContent = leadText;
    });
}

// Function to clear all scores
function clearScores() {
    if (confirm('Are you sure you want to clear all scores? This action cannot be undone.')) {
        // Clear all input fields
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        // Update calculations
        updateCalculations();
    }
}

// Function to update player names in the table header
function updatePlayerNames() {
    const teamAPlayer1 = document.getElementById('teamAPlayer1').value || 'Player 1';
    const teamAPlayer2 = document.getElementById('teamAPlayer2').value || 'Player 2';
    const teamBPlayer1 = document.getElementById('teamBPlayer1').value || 'Player 1';
    const teamBPlayer2 = document.getElementById('teamBPlayer2').value || 'Player 2';

    document.getElementById('teamAPlayer1Header').textContent = teamAPlayer1;
    document.getElementById('teamAPlayer2Header').textContent = teamAPlayer2;
    document.getElementById('teamBPlayer1Header').textContent = teamBPlayer1;
    document.getElementById('teamBPlayer2Header').textContent = teamBPlayer2;
}

// Function to end the game
function endGame() {
    if (confirm('Are you sure you want to end the game? This will show the final results and disable score input.')) {
        // Disable all input fields
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.disabled = true;
        });

        // Disable the clear and game over buttons
        document.querySelector('.clear-button').disabled = true;
        document.querySelector('.game-over-button').disabled = true;

        // Calculate final scores and get team names
        const finalScore = calculateFinalScore();
        const blueTeamPlayer1 = document.getElementById('teamAPlayer1').value || 'Player 1';
        const blueTeamPlayer2 = document.getElementById('teamAPlayer2').value || 'Player 2';
        const redTeamPlayer1 = document.getElementById('teamBPlayer1').value || 'Player 1';
        const redTeamPlayer2 = document.getElementById('teamBPlayer2').value || 'Player 2';

        // Get random message
        const messages = [
            "le pegaron una buena culeada a",
            "se cansaron de fajar a"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Determine winner and loser
        const blueTeamTotal = parseInt(finalScore.split('\n')[0].split(': ')[1]);
        const redTeamTotal = parseInt(finalScore.split('\n')[1].split(': ')[1]);

        let winners, losers;
        if (blueTeamTotal < redTeamTotal) {
            winners = `${blueTeamPlayer1} y ${blueTeamPlayer2}`;
            losers = `${redTeamPlayer1} y ${redTeamPlayer2}`;
        } else if (redTeamTotal < blueTeamTotal) {
            winners = `${redTeamPlayer1} y ${redTeamPlayer2}`;
            losers = `${blueTeamPlayer1} y ${blueTeamPlayer2}`;
        } else {
            // It's a tie
            alert(`Game Over!\n\nFinal Score:\n${finalScore}\n\n¡Empate!`);
            return;
        }

        // Show final results with random message
        alert(`Game Over!\n\nFinal Score:\n${finalScore}\n\n${winners} ${randomMessage} ${losers}`);
    }
}

// Function to calculate final score
function calculateFinalScore() {
    let blueTeamTotal = 0;
    let redTeamTotal = 0;
    let holesPlayed = 0;

    // Calculate scores for each hole
    const rows = document.querySelectorAll('tbody tr:not(.section-header):not(.lead-row)');
    rows.forEach(row => {
        const par = parseInt(row.querySelector('.par').textContent);
        
        // Get scores for Blue Team
        const teamAPlayer1 = parseInt(row.querySelector('td:nth-child(3) input').value) || 0;
        const teamAPlayer2 = parseInt(row.querySelector('td:nth-child(4) input').value) || 0;
        
        // Get scores for Red Team
        const teamBPlayer1 = parseInt(row.querySelector('td:nth-child(5) input').value) || 0;
        const teamBPlayer2 = parseInt(row.querySelector('td:nth-child(6) input').value) || 0;

        if (teamAPlayer1 && teamAPlayer2 && teamBPlayer1 && teamBPlayer2) {
            const teamAScore = calculateTeamScore(teamAPlayer1, teamAPlayer2, par);
            const teamBScore = calculateTeamScore(teamBPlayer1, teamBPlayer2, par);
            
            blueTeamTotal += teamAScore;
            redTeamTotal += teamBScore;
            holesPlayed++;
        }
    });

    // Get team names
    const blueTeamName = document.getElementById('teamAPlayer1').value || 'Blue Team';
    const redTeamName = document.getElementById('teamBPlayer1').value || 'Red Team';

    return `${blueTeamName}: ${blueTeamTotal}\n${redTeamName}: ${redTeamTotal}\n\nHoles Played: ${holesPlayed}`;
}

// Function to show game rules
function toggleRules() {
    const rulesSection = document.querySelector('.rules-section');
    const rulesButton = document.querySelector('.rules-button');
    
    if (rulesSection.style.display === 'none') {
        rulesSection.style.display = 'block';
        rulesButton.textContent = 'Ocultar Reglas';
    } else {
        rulesSection.style.display = 'none';
        rulesButton.textContent = 'Mostrar Reglas';
    }
}

// Initialize the scoreboard
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all input fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateCalculations);
    });

    // Initialize the display
    updateCalculations();
}); 