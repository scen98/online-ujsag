<?php require "header.php";
?>		<script type="module" src="myjs/authorController.js"></script>
		<div class="site-main-container">
			<!-- Start top-post Area -->
			<section class="top-post-area pt-10">
				<div class="container no-padding">
					<div class="row">
						<div class="col-lg-12">
							<div class="news-tracker-wrap">
								<h3><span id="author-name"></span> összes cikke</h3>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- End top-post Area -->
			<!-- Start latest-post Area -->
			<section class="latest-post-area pb-120">
				<div class="container no-padding">
					<div class="row">
						<div class="col-lg-8 post-list">
							<!-- Start latest-post Area -->
							<div id="article-container" class="latest-post-wrap">
							
								
							
							
								
								
							</div>
							<div id="load-more" class="load-more">
									<a href="#" class="primary-btn">Load More Posts</a>
								</div>
							<!-- End latest-post Area -->
						</div>
						<div class="col-lg-4">
							<div class="sidebars-area">
							<?php 
							require "recommended.php"
									?>
								<?php
								require "notes.php";
								?>								
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- End latest-post Area -->
		</div>
	<?php
	require "footer.php";
	?>