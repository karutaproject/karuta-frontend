<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <xsl:output method="xml"/>

	<xsl:param name="matrix">SBI_Matrix</xsl:param>
  <xsl:template match="/">
  	<portfolio>
  		<version>4</version>
  		<asmRoot>
			<metadata-wad seenoderoles="all" />
			<metadata-epm />
			<metadata multilingual-node="N" semantictag="root" sharedNode="N" sharedResource="N" />
			<asmResource xsi_type="nodeRes">
				<code><xsl:value-of select="$matrix"/></code>
				<label lang="en"><xsl:value-of select="$matrix"/></label>
			</asmResource>
			<asmResource xsi_type="context" />
			<asmUnit xsi_type="asmUnit">
				<metadata-wad seenoderoles="all" />
				<metadata-epm />
				<metadata multilingual-node="N" semantictag="dashboard_matrix_2dimsBA" sharedNode="N" sharedNodeResource="N" />
				<asmResource xsi_type="nodeRes">
					<code />
					<label lang="en">Matrix</label>
				</asmResource>
				<asmResource  xsi_type="context"/>
			</asmUnit>
			    <xsl:for-each select="//artifact[name(parent::*)=$matrix]">
					<xsl:for-each select="scaffolding/criteria/criteria">
						<xsl:sort select="@index" data-type="number"/>
						<xsl:variable name="criteria-id"><xsl:value-of select="id"/></xsl:variable>
						<asmStructure xsi_type="asmStructure">
							<metadata-wad seenoderoles="all" />
							<metadata-epm />
							<metadata multilingual-node="N" semantictag="dimA" sharedNode="N" sharedNodeResource="N" />
							<asmResource xsi_type="nodeRes">
								<code />			
								<label lang="en"><xsl:value-of select="description"/></label>
							</asmResource>
							<asmResource  xsi_type="context"/>
							<xsl:for-each select="../../../scaffolding/levels/level">
								<xsl:sort select="@index" data-type="number"/>
								<xsl:variable name="level-id"><xsl:value-of select="id"/></xsl:variable>
								<asmStructure xsi_type="asmStructure">
									<metadata-wad seenoderoles="all" />
									<metadata-epm />
									<metadata multilingual-node="N" semantictag="dimB" sharedNode="N" sharedNodeResource="N" />
									<asmResource xsi_type="nodeRes">
										<code />			
										<label lang="en"><xsl:value-of select="description"/></label>
									</asmResource>
									<asmResource  xsi_type="context"/>
									<xsl:for-each select="../../../cells/cell[scaffoldingCell/rootCriterion/id=$criteria-id and scaffoldingCell/level/id=$level-id]">
									<asmUnit xsi_type="asmUnit">
										<metadata-wad seenoderoles="all" />
										<metadata-epm />
										<metadata multilingual-node="N" semantictag="cell-content" sharedNode="N" sharedNodeResource="N" />
										<asmResource xsi_type="nodeRes">
											<code />			
											<label lang="en"><xsl:value-of select="wizardPage/pageForms/pageForm/artifact/metaData/displayName"/></label>
										</asmResource>
										<asmResource  xsi_type="context"/>
										<!-- ======== page content ======== -->
										<xsl:if test="wizardPage/pageForms/pageForm/artifact/structuredData/portfolioPage/pageContent!=''">
											<asmContext xsi_type="">
												<metadata-wad seenoderoles="all" />
												<metadata-epm />
												<metadata multilingual-node="N" semantictag ="TextField" sharedNode="N" sharedNodeResource="N" sharedResource="N" />
												<asmResource xsi_type="nodeRes">
													<code />
													<label lang="en" />
												</asmResource>
												<asmResource xsi_type="context" />
												<asmResource xsi_type="TextField">
													<text lang="en"><xsl:value-of select="wizardPage/pageForms/pageForm/artifact/structuredData/portfolioPage/pageContent"/></text>
												</asmResource>
											</asmContext>
										</xsl:if>
										<!-- ======== attachment ======== -->
										<xsl:if test="wizardPage/attachments/attachment">
											<asmUnitStructure xsi_type="">
												<metadata-wad seenoderoles="all" />
												<metadata-epm />
												<metadata multilingual-node="N" semantictag="attachments" sharedNode="N" sharedNodeResource="N" />
												<asmResource xsi_type="nodeRes">
													<code />			
													<label lang="en">Attachments</label>
												</asmResource>
												<asmResource  xsi_type="context"/>
											   	<xsl:for-each select="wizardPage/attachments/attachment">
													<asmContext xsi_type="asmContext">
														<metadata-wad seenoderoles="all" />
														<metadata-epm />
														<metadata multilingual-node="N" semantictag ="cell-display" sharedNode="N" sharedNodeResource="N" sharedResource="N" />
														<asmResource xsi_type="nodeRes">
															<code />
															<label lang="en" />
														</asmResource>
														<asmResource xsi_type="context" />
														<asmResource xsi_type="URL">
															<label  lang="en"><xsl:value-of select="artifact/metaData/displayName"/></label>
															<url  lang="en"><xsl:value-of select="artifact/fileArtifact/uri"/></url>
														</asmResource>
													</asmContext>
												</xsl:for-each>
											</asmUnitStructure>
										</xsl:if>
									</asmUnit>
									
									</xsl:for-each>
								</asmStructure>
							</xsl:for-each>
						</asmStructure>				
					</xsl:for-each>
				    <!--artifact>
					    <xsl:for-each select="scaffolding/criteria/criteria">
					    <criteria>
						   	<xsl:value-of select="@index"/>
						   	<id>	<xsl:value-of select="id"/></id>
						   	<description>	<xsl:value-of select="description"/></description>
						   	</criteria>
					    </xsl:for-each>
					    <xsl:for-each select="scaffolding/levels/level">
					    	<level>
						   	<xsl:value-of select="@index"/>
						   	<id>	<xsl:value-of select="id"/></id>
						   	<description>	<xsl:value-of select="description"/></description>
						   	</level>
					    </xsl:for-each>
					    <xsl:for-each select="cells/cell">
						    <xsl:sort select=".//rootCriterion/description"/>
						    <cell>
							   	<criteria-id>	<xsl:value-of select=".//rootCriterion/id"/></criteria-id>
							   	<description>	<xsl:value-of select=".//rootCriterion/description"/></description>
							   	<level-id>	<xsl:value-of select=".//level/id"/></level-id>
							   	<level>	<xsl:value-of select=".//level/description"/></level>
							   	<xsl:for-each select="wizardPage/attachments/attachment">
							   		<attachment><xsl:value-of select="artifact/metaData/displayName"/></attachment>
								</xsl:for-each>
							   	<xsl:for-each select="wizardPage/pageForms/pageForm">
							   		<PageFormTitle><xsl:value-of select="artifact/metaData/displayName"/></PageFormTitle>
							   		<PageFormContent><xsl:value-of select="artifact/structuredData/portfolioPage/pageContent"/></PageFormContent>
								</xsl:for-each>
						   	</cell>
					    </xsl:for-each>
				    </artifact-->
			    </xsl:for-each>
    	</asmRoot>
    </portfolio>
  </xsl:template>
  
    <xsl:template name='criteria'>
    </xsl:template>
  
	
</xsl:stylesheet>