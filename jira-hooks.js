function hook()
{
	function toJ(input) {

		input = input.replace(/^(.*?)\n([=-])+$/gm, function (match,content,level) {
			return 'h' + (level[0] === '=' ? 1 : 2) + '. ' + content;
		});

		input = input.replace(/^([#]+)(.*?)$/gm, function (match,level,content) {
			return 'h' + level.length + '.' + content;
		});

		input = input.replace(/([*_]+)(.*?)\1/g, function (match,wrapper,content) {
			var to = (wrapper.length === 1) ? '_' : '*';
			return to + content + to;
		});
		// Make multi-level bulleted lists work
  		input = input.replace(/^(\s*)- (.*)$/gm, function (match,level,content) {
    			var len = 2;
    			if(level.length > 0) {
        			len = parseInt(level.length/4.0) + 2;
    			}
    			return Array(len).join("-") + ' ' + content;
  		});

		var map = {
			cite: '??',
			del: '-',
			ins: '+',
			sup: '^',
			sub: '~'
		};

		input = input.replace(new RegExp('<(' + Object.keys(map).join('|') + ')>(.*?)<\/\\1>', 'g'), function (match,from,content) {
			//console.log(from);
			var to = map[from];
			return to + content + to;
		});

		input = input.replace(/~~(.*?)~~/g, '-$1-');

		input = input.replace(/`{3,}(\w+)?((?:\n|[^`])+)`{3,}/g, function(match, synt, content) {
			var code = '{code';

			if (synt) {
				code += ':' + synt;
			}

			code += '}' + content + '{code}';

			return code;
		});

		input = input.replace(/`([^`]+)`/g, '{{$1}}');

		input = input.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]');
		input = input.replace(/<([^>]+)>/g, '[$1]');

		return input;
	};
	
	var $ = window.jQuery;
	$(function(){
		$('body').on('submit before-submit', 'form', function(){
			var $form = $(this);
			if ($form.is('.submitting'))
				return; // too late
			
			$('textarea.wiki-textfield', $form).each(function(){
				var $textarea = $(this);
				var markdown = $textarea.val();
				var jiraShite = toJ(markdown);
				$textarea.val(jiraShite);
				setTimeout(function(){
					$textarea.val(markdown);
				},1000);
			});
		});
	});
}

if (document.body.id === "jira") {
	var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ hook +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
}