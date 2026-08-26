package com.vit.result.calc.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Table(name = "result") @Data @NoArgsConstructor
public class Result {
    @Id @NotNull @Min(10000000) @Column(nullable = false, updatable = false) private Integer prn;
    @NotBlank @Pattern(regexp = "^[A-Za-z ]+$") @Column(nullable = false) private String name;
    @NotBlank @Column(nullable = false) private String branch;
    @NotBlank @Column(nullable = false) private String division;
    private Double webTechnologyMse, webTechnologyEse, webTechnologyTotal; private String webTechnologyGrade;
    private Double databaseManagementMse, databaseManagementEse, databaseManagementTotal; private String databaseManagementGrade;
    private Double computerNetworksMse, computerNetworksEse, computerNetworksTotal; private String computerNetworksGrade;
    private Double softwareEngineeringMse, softwareEngineeringEse, softwareEngineeringTotal; private String softwareEngineeringGrade;
    private Double totalMarks, percentage, cgpa; private String finalResult;
    @Transient private Double webTechnologyMseMarks;
    @Transient private Double webTechnologyEseMarks;
    @Transient private Double databaseManagementMseMarks;
    @Transient private Double databaseManagementEseMarks;
    @Transient private Double computerNetworksMseMarks;
    @Transient private Double computerNetworksEseMarks;
    @Transient private Double softwareEngineeringMseMarks;
    @Transient private Double softwareEngineeringEseMarks;
}
