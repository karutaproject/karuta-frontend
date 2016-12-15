<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:xs="http://www.w3.org/2001/XMLSchema"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <xsl:output method="xml"/>

	<xsl:param name="matrix">Matrix</xsl:param>
  <xsl:template match="/">
  	<portfolio>
  		<version>4</version>
  		<asmRoot>
			<metadata-wad seenoderoles="all student" />
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
							<metadata-wad seenoderoles="all" display='N'/>
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
											<metadata-wad seenoderoles="all"/>
											<metadata-epm />
											<metadata multilingual-node="N" semantictag="cell-content" sharedNode="N" sharedNodeResource="N" />
											<asmResource xsi_type="nodeRes">
												<code />			
												<label lang="en"><!--xsl:value-of select="wizardPage/pageForms/pageForm/artifact/metaData/displayName"/--></label>
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
											<!-- ======== pageForm ======== -->
											<xsl:if test="wizardPage/pageForms/pageForm">
												<!--asmUnitStructure xsi_type="">
													<metadata-wad seenoderoles="all" />
													<metadata-epm />
													<metadata multilingual-node="N" semantictag="evaluations" sharedNode="N" sharedNodeResource="N" />
													<asmResource xsi_type="nodeRes">
														<code />			
														<label lang="en">Form</label>
													</asmResource>
													<asmResource  xsi_type="context"/-->
												   	<xsl:for-each select="wizardPage/pageForms/pageForm">
														<xsl:call-template name="artifact"/>
													</xsl:for-each>
												<!--/asmUnitStructure-->
											</xsl:if>
											<!-- ======== evaluation ======== -->
											<xsl:if test="wizardPage/evaluations/evaluation">
												<asmUnitStructure xsi_type="">
													<metadata-wad seenoderoles="all" />
													<metadata-epm />
													<metadata multilingual-node="N" semantictag="evaluations" sharedNode="N" sharedNodeResource="N" />
													<asmResource xsi_type="nodeRes">
														<code />			
														<label lang="en">Evaluations</label>
													</asmResource>
													<asmResource  xsi_type="context"/>
												   	<xsl:for-each select="wizardPage/evaluations/evaluation">
														<xsl:call-template name="artifact"/>
													</xsl:for-each>
												</asmUnitStructure>
											</xsl:if>
											<!-- ======== feedback ======== -->
											<xsl:if test="wizardPage/feedback/feedback">
												<asmUnitStructure xsi_type="">
													<metadata-wad seenoderoles="all" />
													<metadata-epm />
													<metadata multilingual-node="N" semantictag="feedbacks" sharedNode="N" sharedNodeResource="N" />
													<asmResource xsi_type="nodeRes">
														<code />			
														<label lang="en">Feedbacks</label>
													</asmResource>
													<asmResource  xsi_type="context"/>
												   	<xsl:for-each select="wizardPage/feedback/feedback">
														<xsl:call-template name="artifact"/>
													</xsl:for-each>
												</asmUnitStructure>
											</xsl:if>
											<!-- ======== reflections ======== -->
											<xsl:if test="wizardPage/reflections/reflection">
												<asmUnitStructure xsi_type="">
													<metadata-wad seenoderoles="all" />
													<metadata-epm />
													<metadata multilingual-node="N" semantictag="reflections" sharedNode="N" sharedNodeResource="N" />
													<asmResource xsi_type="nodeRes">
														<code />			
														<label lang="en">Reflections</label>
													</asmResource>
													<asmResource  xsi_type="context"/>
												   	<xsl:for-each select="wizardPage/reflections/reflection">
														<xsl:call-template name="artifact"/>
													</xsl:for-each>
												</asmUnitStructure>
											</xsl:if>
											<!-- ============================ -->
										</asmUnit>
									</xsl:for-each>
								</asmStructure>
							</xsl:for-each>
						</asmStructure>				
					</xsl:for-each>
			    </xsl:for-each>
    	</asmRoot>
    </portfolio>
  </xsl:template>
 
  <xsl:template name='artifact'>
	<asmUnitStructure xsi_type="">
		<metadata-wad seenoderoles="all" />
		<metadata-epm />
		<metadata multilingual-node="N" semantictag="evaluation" sharedNode="N" sharedNodeResource="N" />
		<asmResource xsi_type="nodeRes">
			<code />			
			<label lang="en"><xsl:value-of select="artifact/metaData/displayName"/></label>
		</asmResource>
		<asmResource  xsi_type="context"/>
		<!-- ======== -->
		<asmContext xsi_type="asmContext">
			<metadata-wad seenoderoles="all" display='N'/>
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
		<!-- ======== -->
		<xsl:for-each select="artifact/schema/element/children/element">
			<xsl:variable name='elt'><xsl:value-of select="@name"/></xsl:variable>
			<xsl:variable name='label'><xsl:value-of select="xs:annotation/xs:documentation[@source='ospi.label']"/></xsl:variable>
			<xsl:variable name='type'><xsl:value-of select="@type"/></xsl:variable>
			<xsl:for-each select="../../../../structuredData//*[local-name()=$elt]">
				<asmContext xsi_type="asmContext">
					<metadata-wad seenoderoles="all" />
					<metadata-epm />
					<metadata multilingual-node="N" semantictag ="cell-display" sharedNode="N" sharedNodeResource="N" sharedResource="N" />
					<xsl:choose>
						<xsl:when test="$type='xs:anyURI'">
							<asmResource xsi_type="nodeRes">
								<code />
								<label lang="en"></label>
							</asmResource>
							<asmResource xsi_type="context" />
							<asmResource xsi_type="URL">
								<label  lang="en"><xsl:value-of select="$elt"/></label>
								<url  lang="en"><xsl:value-of select="normalize-space(.)"/></url>
							</asmResource>
						</xsl:when>
						<xsl:otherwise>
							<asmResource xsi_type="nodeRes">
								<code />
								<label lang="en"><xsl:value-of select="$label"/></label>
							</asmResource>
							<asmResource xsi_type="context" />
							<asmResource xsi_type="TextField">
										<text  lang="en"><xsl:value-of select="normalize-space(.)"/></text>
							</asmResource>
						</xsl:otherwise>
					</xsl:choose>
				</asmContext>
			</xsl:for-each>
		</xsl:for-each>
		<!-- ======== -->
	</asmUnitStructure>
	</xsl:template>  

    <xsl:template name='criteria'>
    </xsl:template>
  
	
</xsl:stylesheet>