          
          
          
            const SoftBadge = ({ value }) =>
              value ? (
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                  {value}
                </span>
              ) : null;








                  {/* Initial Risk */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.initialRiskSeverity}
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.initialRiskLikelyhood}
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>

                  {/* Risk Level */}
                  <td className="border border-gray-200 px-2 py-1 w-20">
                    {(() => {
                      const risk = getRiskLevel(
                        row.initialRiskSeverity,
                        row.initialRiskLikelyhood
                      );

                      return <SoftBadge value={risk.label} color={risk.color} />;
                    })()}
                  </td>

                  {/* İlk Action */}

                  {/* Residual Risk */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.residualRiskSeverity}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.residualRiskLikelyhood}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1 w-20">
                    {(() => {
                      const risk = getRiskLevel(
                        row.residualRiskSeverity,
                        row.residualRiskLikelyhood
                      );

                      return <SoftBadge value={risk.label} color={risk.color} />;
                    })()}
                  </td>