async function fetchVideoNotes(videoId) {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your YouTube API Key
    const response = await fetch(`https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&key=${apiKey}`);
    const data = await response.json();

    // Check if captions are available
    if (data.items && data.items.length > 0) {
        const transcriptId = data.items[0].id; // First caption track
        const transcriptResponse = await fetch(`https://www.googleapis.com/youtube/v3/captions/${transcriptId}?key=${apiKey}`);
        const transcriptData = await transcriptResponse.json();
        
        return formatNotes(transcriptData); // Format the notes before returning
    } else {
        return "No transcript available";
    }
}

function formatNotes(transcriptData) {
    let formattedNotes = "<h1>Video Notes</h1>";
    formattedNotes += "<h2>Key Takeaways</h2>";
    formattedNotes += "<ul>";

    // Assume transcriptData is an array of text segments
    transcriptData.forEach(segment => {
        formattedNotes += `<li>${segment.text}</li>`;
    });

    formattedNotes += "</ul>";

    // Additional sections can be added here
    formattedNotes += "<h2>Summary</h2>";
    formattedNotes += "<p>Here you can write a brief summary of the video content.</p>";

    return formattedNotes; // Return the formatted notes
}

// Update the display function to show formatted notes
function displayNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = notes; // Update innerHTML to include formatted notes
}

// On button click
document.getElementById('generateNotesButton').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrlInput').value;
    const videoId = extractVideoId(videoUrl); // Function to extract video ID from URL

    if (videoId) {
        const notes = await fetchVideoNotes(videoId);
        displayNotes(notes);
    } else {
        alert("Invalid YouTube URL");
    }
});

function extractVideoId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regExp);
    return matches ? matches[1] : null;
}
