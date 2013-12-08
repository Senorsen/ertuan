<!doctype html>
<html>
<head>
<meta name="content-type" content="text/html" charset="utf-8">
<title>我的二团我的连</title>
<link rel="stylesheet" href="css/index.css">
<link rel="stylesheet" href="css/flowplayer.css">
<link rel="stylesheet" href="css/perfect-scrollbar.css">
<link rel="stylesheet" href="css/nivo-slider.css">
<link rel="stylesheet" href="css/bar/bar.css">
<script src="js/jquery.js"></script>
<script src="js/jquery.color.js"></script>
<script src="js/jquery.jplayer.min.js"></script>
<script src="js/jquery.typewriter.js"></script>
<script src="js/jquery.nivo.slider.pack.js"></script>
<script src="js/flowplayer.js"></script>
<script src="js/perfect-scrollbar.js"></script>
<script src="js/view.min.js"></script>
<script>
<?php
$latest=6;
if($_SERVER['QUERY_STRING']!='')
{
	$this_num=$_SERVER['QUERY_STRING'];
}
else
{
	header('Location: ?'.$latest);
	exit;
}
echo "pds.number=$this_num;";
?>
document.title="我的二连我的团 第<?=$this_num?>期";
</script>
</head>
<body>
<div id="preloader-layer" style="display:none"></div>
<div id="container">
<div id="main-mp3-layer"></div>
<div id="main-video-layer"><div id="player" style="width:100%;height:100%;"></div></div>
<div id="main-layer"><div id="bgpic-layer"><div id="content-layer"></div></div><div id="page_layer"></div><div id="page_id_layer"><div id="page_id"></div></div></div>
<div id="controller-layer"><div id="controller-first" class="controller-button"></div><div id="controller-menu" class="controller-button"></div><div id="controller-end" class="controller-button"></div><div id="controller-prev" class="controller-button"></div><div id="controller-next" class="controller-button"></div><div id="controller-fullscreen" class="controller-button"></div></div>
<div id="active-layer"></div>
</div>
</body>
</html>
