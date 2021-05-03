<script type="text/javascript" src="js/textEditController.js" defer ></script>
    <div id="edit-controls" class="editcontrols">
            <button class="controlbtn shine" title="vissza" onclick="execCmd('undo');"><i class="fas fa-undo"></i></button>
            <button class="controlbtn shine" title="újra" onclick="execCmd('redo');"><i class="fas fa-redo"></i></button>
            <button id="save-article-button" title="mentés" class="controlbtn  green" type="button" id="submit"><i class="fas fa-save"></i></button>
            <button class="controlbtn shine" title="minden kiválasztása" onclick="execCmd('selectAll');"><i class="fas fa-globe-europe"></i></button>
            <button class="controlbtn shine" title="hiperhivatkozás beszúrása" onclick="execCommandWithArg('createLink', prompt('Enter a URL', 'http://'));"><i class="fas fa-link"></i></button>
            <button class="controlbtn shine" title="hiperhivatkozás eltávolítása" onclick="execCmd('unlink');"><i class="fas fa-unlink"></i></button>
            <button class="controlbtn shine" title="kép beszúrása" onclick="execCommandWithArg('insertImage', prompt('Enter the image URL', ''));"><i class="fa fa-file-image-o"></i></button>
            <button class="controlbtn shine" title="YT videó beszúrása" onclick="insertVideo(prompt('Enter the video URL', ''));"><i class="fab fa-youtube"></i></button><br>
            <button class="controlbtn shine" title="félkövér" onclick="execCmd('bold');"><i class="fas fa-bold"></i></button>
            <button class="controlbtn shine" title="dőlt" onclick="execCmd('italic');"><i class="fas fa-italic"></i></button>
            <button class="controlbtn shine" title="aláhúzott" onclick="execCmd('underline');"><i class="fas fa-underline"></i></button>
            <button class="controlbtn shine" title="áthúzott" onclick="execCmd('strikeThrough');"><i class="fas fa-strikethrough"></i></button>   
            <button class="controlbtn shine" title="balra igazítás" onclick="execCmd('justifyLeft');"><i class="fas fa-align-left"></i></button>
            <button class="controlbtn shine" title="középre igazítás" onclick="execCmd('justifyCenter');"><i class="fas fa-align-center"></i></button>
            <button class="controlbtn shine" title="jobbra igazítás" onclick="execCmd('justifyRight');"><i class="fas fa-align-right"></i></button>
            <button class="controlbtn shine" title="sorkizárt" onclick="execCmd('justifyFull');"><i class="fas fa-align-justify"></i></button>
            <button class="controlbtn shine" title="kivágás" onclick="execCmd('cut');"><i class="fas fa-cut"></i></button>
            <button class="controlbtn shine" title="másolás" onclick="execCmd('copy');"><i class="fas fa-copy"></i></button>
            <button class="controlbtn shine" title="behúzás" onclick="execCmd('indent');"><i class="fas fa-indent"></i></button>
            <button class="controlbtn shine" title="kihúzás" onclick="execCmd('outdent');"><i class="fas fa-outdent"></i></button>
            <button class="controlbtn shine" title="alsó index" class="controlbtn" onclick="execCmd('subscript');"><i class="fas fa-subscript"></i></button>
            <button class="controlbtn shine" title="felső index" onclick="execCmd('superscript');"><i class="fas fa-superscript"></i></button>
            <button class="controlbtn shine" title="számozatlan lista" onclick="execCmd('insertUnorderedList');"><i class="fas fa-list-ul"></i></button>
            <button class="controlbtn shine" title="számozott lista" onclick="execCmd('insertOrderedList');"><i class="fas fa-list-ol"></i></button>
            <button class="controlbtn shine" title="bekezdés beszúrása" onclick="execCmd('insertParagraph');"><i class="fas fa-paragraph"></i></button>         
            <select class="controlbtn shine" title="fejléc" onchange="execCommandWithArg('formatBlock', this.value);" >
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
            </select>
            <button class="controlbtn shine" title="vonal" onclick="execCmd('insertHorizontalRule');">__</button>
            <select  class="columnselect" title="betűtípus" onchange="execCommandWithArg('fontName', this.value);" >
                <option value="Arial">Arial</option>
                <option value="Comain Sans">Comain Sans</option>
                <option value="Courier">Courier</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>
            <select  class="columnselect" title="betűméret" onchange="execCommandWithArg('fontSize', this.value);" >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
            </select>
            <!--<button class="controlbtn" onclick="execCommandWithArg('insertImage', prompt('Enter the image URL', ''));" ><i class="fa fa-file-image-o"></i></button> -->            
        </div>        
        <iframe class="textedit" value="texts" id="txtField" name="richTextField"></iframe>   
